import { ChromaClient } from 'chromadb';
import { Embedding } from './ai-model';
import { ClientConfig } from '@adobe/pdfservices-node-sdk';


export abstract class Database {
	static get(url: string): Database {
		return new ChromaDatabase(url);
	}
	abstract upload(embed: Embedding): Promise<boolean>
}

class ChromaDatabase extends Database {
	private client: ChromaClient;

	constructor(url: string) {
		super();
		this.client = new ChromaClient({ path: url });
	}

	async upload(embed: Embedding): Promise<boolean> {

	}
}