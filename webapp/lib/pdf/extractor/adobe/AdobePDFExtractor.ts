import {
	MimeType,
	ExtractElementType,
	ExtractPDFJob,
	ExtractPDFParams,
	ExtractPDFResult,
	ExtractRenditionsElementType,
	PDFServices,
	SDKError,
	ServiceApiError,
	ServicePrincipalCredentials,
	ServiceUsageError
} from '@adobe/pdfservices-node-sdk';
import JSZip from 'jszip'
import { Readable } from 'stream';
import { ImageAsset, GenericAsset } from '../../../ai-model/assets'
import { PDF, PDFExtractor, AdobePDFExtractionCredentials } from '../PDFExtractor'
import { PDFExtractionError } from '../../../errors';

type ExtractedJson = {
	version: {
		schema: string
		structure: string
		page_segmentation: string
		json_export: string
		table_structure?: string
	}
	extended_metadata: {
		ID_instance?: string
		ID_permanent?: string
		pdf_version: string
		pdfa_compliance_level: string
		is_encrypted: boolean
		has_acroform: boolean
		is_signed: boolean
		pdfua_compliance_level: string
		page_count: number
		has_embedded_files: boolean
		is_certified: boolean
		is_XFA: boolean
		language: string
		extension_base_version?: string
		extension_level?: number
	}
	elements: {
		Bounds?: number[]
		ClipBounds?: number[]
		CharBounds?: number[]
		Font?: {
			alt_family_name: string
			embedded: boolean
			encoding: string
			family_name: string
			font_type: string
			italic: boolean
			monospaced: boolean
			name: string
			subset: boolean
			weight: number
		}
		HasClip?: boolean
		Lang?: string
		Page?: number
		Path: string
		Text?: string
		TextSize?: number
		attributes?: {
			LineHeight?: number
			SpaceAfter?: number
			TextAlign?: string
			Placement?: string
			BBox?: number[]
			NumCol?: number
			NumRow?: number
			TextPosition?: string
			StartIndent?: number
			TextDecorationColor?: number[]
			TextDecorationThickness?: number
			TextDecorationType?: string
			BlockAlign?: string
			BorderColor?: number[]
			BorderStyle?: string | string[]
			BorderThickness?: number | number[]
			ColIndex?: number
			Height?: number
			InlineAlign?: string
			RowIndex?: number
			Width?: number
			BackgroundColor?: number[]
			BaselineShift?: number
			ColSpan?: number
			RowSpan?: number
		}
		Skew?: number
		Rotation?: number
		Image?: {
			bits_per_component: number
			colorspace: {
				Name: string
				ICCProfile?: {
					"CMM ID": string
					ColorSpace: string
					Colorspace: string
					Creator: string
					Date: string
					"Device Class": string
					Flags: string
					ICCVersion: string
					Illuminant: string
					Magic: string
					Manufacturer: string
					Model: string
					Name: string
					NumComps: number
					PCS: string
					Platform: string
					"Rendering Intent": string
					Size: string
				}
			}
			data_length: number
			height: number
			resolution_horizontal: number
			resolution_vertical: number
			width: number
		}
		filePaths?: string[]
	}[]
	pages: {
		page_number: number
		width: number
		height: number
		is_scanned: boolean
		rotation: number
		user_units?: number
		boxes: {
			MediaBox: number[]
			CropBox: number[]
		}
	}[]
}

export class AdobePDFExtractor extends PDFExtractor {
	private services: PDFServices;
	private static readonly unzipper = new JSZip();
	private static readonly params = new ExtractPDFParams({
		elementsToExtractRenditions: [
			ExtractRenditionsElementType.FIGURES,
			ExtractRenditionsElementType.TABLES
		],
		elementsToExtract: [
			ExtractElementType.TEXT,
			ExtractElementType.TABLES
		]
	});

	constructor({ key, secret }: AdobePDFExtractionCredentials) {
		super();
		const credentials = new ServicePrincipalCredentials({
			clientId: key,
			clientSecret: secret
		});
		this.services = new PDFServices({ credentials });
	}

	public async extract(file: Buffer): Promise<PDF> {
		const stream = Readable.from(file);
		try {
			const job = await this.makeJob(stream);
			const url = await this.services.submit({ job });
			const outStream = await this.getResult(url);
			return await this.unzip(outStream);
		} catch (err) {
			if (err instanceof SDKError || err instanceof ServiceApiError || err instanceof ServiceUsageError)
				throw new PDFExtractionError(err.message);
			else
				throw err;
		} finally {
			stream.destroy();
		}
	}

	private async makeJob(stream: NodeJS.ReadableStream) {
		const inputAsset = await this.services.upload({
			readStream: stream,
			mimeType: MimeType.PDF
		});
		return new ExtractPDFJob({
			inputAsset,
			params: AdobePDFExtractor.params
		});
	}
	private async getResult(url: string) {
		const response = await this.services.getJobResult({
			pollingURL: url,
			resultType: ExtractPDFResult
		});
		const streamAsset = await this.services.getContent({
			asset: response.result?.resource || {}
		});
		return streamAsset.readStream;
	}
	private async unzip(zipStream: NodeJS.ReadableStream): Promise<PDF> {
		function parseFolder(folderName: string) {
			zip.folder(folderName)?.forEach((filepath, file) => {
				file.async('nodebuffer')
					.then(data => assetPool[filepath] = {
						data,
						mimeType: 'image/png'
					});
			});
		}

		const zip = await AdobePDFExtractor.unzipper.loadAsync(zipStream);
		const assetPool: Record<string, ImageAsset> = {};
		parseFolder('figures');
		parseFolder('tables');

		const jsonData = await zip.file('structuredData.json')?.async('string') || '';
		const data = JSON.parse(jsonData) as ExtractedJson;
		const pdf: PDF = {
			assets: new Array<GenericAsset>(data.extended_metadata.page_count),
			language: data.extended_metadata.language
		}

		data.elements.forEach(item => {
			pdf.assets.push({
				data: Buffer.from(item.Text || '', 'utf-8'),
				mimeType: 'text/plain'
			});

			item.filePaths?.forEach(path => {
				if (path in assetPool)
					pdf.assets.push(assetPool[path]);
			});
		})

		return pdf;
	}
}