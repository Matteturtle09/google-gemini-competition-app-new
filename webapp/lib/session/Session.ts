import { PDFExtractor, PDFExtractionParams } from '../pdf/extractor/pdfextractor'
import { Database, DatabaseParams } from '../databases/Database'
import { AIChat, AIChatParams } from '../ai-model/AIChat'
import { GenericAsset, Prompt, Answer } from '../ai-model/assets';

export type SessionConfig = {
    chat: AIChatParams;
    PDFExtraction: PDFExtractionParams;
    database: DatabaseParams;
}

export class Session {
    public readonly id: string;

    private pdfExtractor: PDFExtractor;
    private database: Database;
    private chat: AIChat;
    
    public constructor(id: string, config: SessionConfig) {
        this.id = id;
        this.pdfExtractor = PDFExtractor.for(config.PDFExtraction);
        this.database = Database.for(config.database);
        this.chat = AIChat.for(config.chat);
    }

    public async handle(prompt: Prompt): Promise<Answer> {
        const assets = await this.extractAssets(prompt);
        await this.database.embed(assets);
        const nativePrompt = this.chat.toNativePrompt(assets);
        const dbquery = await this.chat.call(nativePrompt);
        const ragAssets = await this.database.fetch(dbquery.data);
        const nativeRagPrompt = this.chat.toNativePrompt(ragAssets);
        const result = await this.chat.send(nativePrompt, nativeRagPrompt); 
        return result;
    }

    private async extractAssets(prompt: Prompt): Promise<GenericAsset[]> {
        const assets = prompt.assets;
        for (const doc of prompt.docs) {
            const pdf = await this.pdfExtractor.extract(doc.data);

            assets.splice(doc.index, 0, ...pdf.assets);
        }
        return assets;
    }
}