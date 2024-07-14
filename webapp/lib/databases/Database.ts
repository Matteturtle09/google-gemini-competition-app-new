import { VectorStore } from '@langchain/core/vectorstores'
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { GenericAsset } from '../ai-model/assets'

export type EmbeddingFunctionService = 'gemini';
interface DatabaseParamsBase {
	url: string;
	embeddingFunctionService: EmbeddingFunctionService;
}
export interface ChromaDatabaseParams extends DatabaseParamsBase {
	service: 'chroma';
	credentials?: never;
}
export type DatabaseParams = ChromaDatabaseParams;


export class Database {
	private database: VectorStore

	private constructor(database: VectorStore) {
		this.database = database;
	}

	public async embed(assets: GenericAsset[]) {
		const docs = assets.map(asset => ({
			pageContent: asset.data.toString('base64'),
			metadata: { mimeType: asset.mimeType }
		}));
		await this.database.addDocuments(docs);
	}
	public async fetch(query: string): Promise<GenericAsset[]> {
		const docs = await this.database.similaritySearch(query);

		return docs.map(doc => ({
			data: Buffer.from(doc.pageContent, 'base64'),
			mimeType: doc.metadata['mimeType']
		}));
	}

	public static for({ service, embeddingFunctionService, url }: DatabaseParams): Database {
		const embeddingFunction = (() => {
			switch (embeddingFunctionService) {
				case 'gemini': return new GoogleGenerativeAIEmbeddings();
			}
		})();
		const vectorStore = (() => {
			switch (service) {
				case 'chroma': return new Chroma(embeddingFunction, { url });
			}
		})();
		return new Database(vectorStore);
	}
}