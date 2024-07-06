import adobe from '@adobe/pdfservices-node-sdk';
import { Readable } from 'stream'
import { PDF } from './ai-model'

export class PDFExtractor {
    private readonly services: adobe.PDFServices;

    constructor(id: string, secret: string) {
        this.services = new adobe.PDFServices({
            credentials: new adobe.ServicePrincipalCredentials({
                clientId: id,
                clientSecret: secret
            })
        });
    }
    public async submit(pdf: PDF): Promise<string> {
        return await this.services.submit({
            job: new adobe.ExtractPDFJob({
                inputAsset: await this.services.upload({
                    readStream: Readable.from(pdf.data),
                    mimeType: adobe.MimeType.PDF
                }),
                params: new adobe.ExtractPDFParams({
                    elementsToExtract: [adobe.ExtractElementType.TEXT]
                })
            })
        });
    }
    public async receive(url: string): Promise<string> {
        const response = await this.services.getJobResult({
            pollingURL: url,
            resultType: adobe.ExtractPDFResult
        });
        return JSON.stringify(response.result?.contentJSON);
    }
    public async extract(pdf: PDF): Promise<string> {
        const url: string = await this.submit(pdf);
        return await this.receive(url);
    }
}

export const extractor: PDFExtractor = new PDFExtractor(
    process.env.PDF_SERVICES_CLIENT_ID || '',
    process.env.PDF_SERVICES_CLIENT_SECRET || ''
);