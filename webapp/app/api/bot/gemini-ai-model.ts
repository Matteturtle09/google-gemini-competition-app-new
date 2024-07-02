import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { AIModel, Prompt, Answer, InputType } from './ai-model'
import { Session } from '../new-session/sessions'

abstract class GeminiAIModel implements AIModel {
	protected model: GenerativeModel;

	protected constructor(model: GenerativeModel) {
		this.model = model
	}

	abstract run(req: Prompt): Promise<Answer>;
}
class GeminiTextAIModel extends GeminiAIModel {
	public constructor(model: GenerativeModel) {
		super(model);
	}
	async run(prompt: Prompt): Promise<Answer> {
		const result = await this.model.generateContent(prompt.text || '');
		const response = await result.response;
		return {
			text: response.text()
		}
	}
}
class GeminiImageAIModel extends GeminiAIModel {
	public constructor(model: GenerativeModel) {
		super(model);
	}

	async run(req: Prompt): Promise<Answer>;
}
class GeminiGenericAIModel extends GeminiAIModel {
	public constructor(model: GenerativeModel) {
		super(model);
	}

	async run(req: Prompt): Promise<Answer>;
}


class GeminiSession implements Session {
	public readonly id: string;
	private ai: GoogleGenerativeAI;
	constructor(id: string, key: string) {
		this.ai = new GoogleGenerativeAI(key);
		this.id = id;
	}

	model(name: string): AIModel {
		return new GeminiGenericAIModel(this.ai.getGenerativeModel({ model: name }));
	}
	modelFor(type: InputType): AIModel {
		switch (type) {
			case InputType.TEXT:
				return new GeminiTextAIModel(this.ai.getGenerativeModel({
					model: ''
				}));
			case InputType.IMAGE:
				return new GeminiImageAIModel(this.ai.getGenerativeModel({
					model: ''
				}));
			case InputType.TEXT_IMAGE:
				return new GeminiGenericAIModel(this.ai.getGenerativeModel({
					model: ''
				}));
			default: throw new Error('Invalid content type');
		}
	}
}

export function createGeminiSession(id: string, apiKey: string): GeminiSession {
	return new GeminiSession(id, apiKey);
}