import adobe from '@adobe/pdfservices-node-sdk'
import { Readable } from 'stream';


export class PDFExtractor {
	private services: adobe.PDFServices;

	constructor(key: string, id: string) {
		this.services = new adobe.PDFServices({
			credentials: new adobe.ServicePrincipalCredentials({
				clientId: id,
				clientSecret: key
			})
		});
	}

	async submit(file: Buffer): Promise<string> {
		const stream = Readable.from(file)
		try {
			const inputAsset = await this.services.upload({
					readStream: stream,
					mimeType: adobe.MimeType.PDF
			});
			const params = new adobe.ExtractPDFParams({
				tableStructureType: adobe.TableStructureType.CSV,
				addCharInfo: false,
				getStylingInfo: false,
				elementsToExtractRenditions: [
					adobe.ExtractRenditionsElementType.TABLES,
					adobe.ExtractRenditionsElementType.FIGURES
				],
				elementsToExtract: [
					adobe.ExtractElementType.TEXT,
					adobe.ExtractElementType.TABLES
				]
			});
			const job = new adobe.ExtractPDFJob({ inputAsset, params });
			const url = await this.services.submit({ job });
			return url;
		} catch (err) {
			if (err instanceof adobe.SDKError
				|| err instanceof adobe.ServiceUsageError
				|| err instanceof adobe.ServiceApiError)
				throw new PDFExtractionError(err.message);
			else
				throw err;
		} finally {
			stream.destroy();
		}
	}
	async receive(url: string): Promise<PDF> {
		const response = await this.services.getJobResult({
			pollingURL: url,
			resultType: adobe.ExtractPDFResult
		});
		const zipAsset = response.result?.resource;
		const zip = await this.services.getContent({ asset: zipAsset })
	}
	async extract(file: Buffer): Promise<PDF> {
		const url = await this.submit(file);
		return await this.receive(url);
	}
}