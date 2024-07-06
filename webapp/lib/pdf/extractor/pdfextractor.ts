import adobe from '@adobe/pdfservices-node-sdk';
import JSZip from 'jszip'
import path from 'path'
import { Readable } from 'stream';
import { ImageAsset, PDF, Table } from '../../types';
import { PDFExtractionError } from '../../errors';

export class PDFExtractor {
	private readonly unzipper = new JSZip();
	private services: adobe.PDFServices;

	constructor(id: string, key: string) {
		const credentials = new adobe.ServicePrincipalCredentials({
			clientId: id,
			clientSecret: key
		});
		this.services = new adobe.PDFServices({ credentials });
	}

	public async submit(file: Buffer): Promise<string> {
		const stream = Readable.from(file);
		try {
			const inputAsset = this.services.upload({
				readStream: stream,
				mimeType: adobe.MimeType.PDF
			});
			const params = new adobe.ExtractPDFParams({
				tableStructureType: adobe.TableStructureType.CSV,
				addCharInfo: false,
				getStylingInfo: false,
				elementsToExtractRenditions: [
					adobe.ExtractRenditionsElementType.FIGURES,
					adobe.ExtractRenditionsElementType.TABLES
				],
				elementsToExtract: [
					adobe.ExtractElementType.TEXT,
					adobe.ExtractElementType.TABLES
				]
			});
			const job = new adobe.ExtractPDFJob({ inputAsset, params });
			return await this.services.submit({ job });
		} catch (err: unknown) {
			if (err instanceof adobe.SDKError || err instanceof adobe.ServiceApiError || err instanceof adobe.ServiceUsageError)
				throw new PDFExtractionError(err.message);
			else
				throw err;
		} finally {
			stream.destroy();
		}
	}
	public async receive(url: string): Promise<PDF> {
		const response = await this.services.getJobResult({
			pollingURL: url,
			resultType: adobe.ExtractPDFResult
		});
		const streamAsset = await this.services.getContent({
			asset: response.result?.resource
		});
		return await this.unzip(streamAsset.readStream);
	}
	public async extract(file: Buffer): Promise<PDF> {
		const url = await this.submit(file);
		return await this.receive(url);
	}

	private readTable(fileSource: string): Table {
		const data = fileSource.split('\n');
		let table: Table = { header: [], rows: [] }

		table.header = data.shift()?.split(',') || [];
		data.forEach(row => table.rows.push({ data: row.split(',') }));

		return table;
	}
	private async unzip(zipStream: NodeJS.ReadableStream): Promise<PDF> {
		let pdf: PDF = {
			images: [],
			tables: [],
			layout: {}
		}
		const zip = await this.unzipper.loadAsync(zipStream);

		// read json data
		const jsondata = await zip.file('structuredData.json')?.async('string');
		pdf.layout = JSON.parse(jsondata || '');

		// read images
		zip.folder('figures')?.forEach(async (_, file) => {
			pdf.images.push({
				data: await file.async('nodebuffer'),
				mimeType: 'image/png'
			});
		});

		// read tables
		const tablesFolder = zip.folder('tables');
		tablesFolder?.forEach(async (filepath, file) => {
			// reads the table and the related images creating the asset
			const tableFileContent = await file.async('string');
			const imageFilePath = path.parse(filepath).name + '.png';
			const imageFileContent =
				await tablesFolder.file(imageFilePath)?.async('nodebuffer');
	
			pdf.tables.push({
				table: this.readTable(tableFileContent),
				image: {
					data: imageFileContent || new Buffer(0),
					mimeType: 'image/png'
				}
			});
		});

		return pdf;
	}
}