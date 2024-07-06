import gemini from '@google/generative-ai';
import { Session } from '../sessions';
import {
	Prompt,
	Embedding,
	Answer,
	AIModel,
	InputType
} from '../../types';


class GeminiAIModel implements AIModel {
	private model: gemini.GenerativeModel;

	constructor(model: gemini.GenerativeModel) {
		this.model = model
	}

	async generate(prompt: Prompt): Promise<Answer> {
		const parts = this.promptToParts(prompt);
		const result = await this.model.generateContent(parts);
		return {
			type: 'text',
			data: result.response.text()
		}
	}
	async embed(prompt: Prompt): Promise<Embedding> {
		const parts = this.promptToParts(prompt);
		const result = await this.model.embedContent(parts);
		return { values: result.embedding.values }
	}

	private promptToParts(prompt: Prompt): gemini.Part[] {
		return prompt.map(item => {
			if (typeof item === 'string')
				return { text: item } as gemini.TextPart;
			else
				return {
					inlineData: {
						data: item.data.toString('base64'),
						mimeType: item.mimeType
					}
				} as gemini.InlineDataPart;
		});
	}
}


class GeminiSession implements Session {
	public readonly id: string;

	private ai: gemini.GoogleGenerativeAI;

	private static models = {
		'text': '',
		'image': '',
		'text-image': '',
		'pdf': ''
	};

	constructor(id: string, key: string) {
		this.ai = new gemini.GoogleGenerativeAI(key);
		this.id = id;
	}

	model(name: string): AIModel {
		return new GeminiAIModel(this.ai.getGenerativeModel({
			model: name
		}));
	}
	modelFor(type: InputType): AIModel {
		return new GeminiAIModel(this.ai.getGenerativeModel({
			model: GeminiSession.models[type]
		})); 
	}
}

export function newGeminiSession(id: string, apiKey: string): GeminiSession {
	return new GeminiSession(id, apiKey);
}