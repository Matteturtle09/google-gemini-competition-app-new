import { GenericAsset } from '../../ai-model/assets';
import { AdobePDFExtractor } from './adobe/AdobePDFExtractor'

export type PDF = {
	assets: GenericAsset[];
	language: string;
}

export type AdobePDFExtractionCredentials = {
	key: string;
	secret: string;
}
export type AdobePDFExtractionParams = {
	service: 'adobe';
	credentials: AdobePDFExtractionCredentials;
}

export type PDFExtractionParams = AdobePDFExtractionParams;

export abstract class PDFExtractor {
	public abstract extract(file: Buffer): Promise<PDF>;

	public static for({ service, credentials }: PDFExtractionParams): PDFExtractor {
		switch (service) {
			case 'adobe': return new AdobePDFExtractor(credentials);
		}
	}
}