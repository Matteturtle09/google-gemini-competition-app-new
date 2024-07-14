import { HumanMessage } from '@langchain/core/messages'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { BaseListChatMessageHistory, InMemoryChatMessageHistory } from '@langchain/core/chat_history'
import { RunnableWithMessageHistory } from '@langchain/core/runnables'
import { Answer, GenericAsset } from './assets';


export type GeminiChatParams = {
	service: 'gemini';
	credentials?: never;
}
export type AIChatParams = GeminiChatParams;

export class AIChat {
	private chat: BaseChatModel;
	private chatWithHistory: RunnableWithMessageHistory<any, any>;
	private history: BaseListChatMessageHistory;

	private constructor(chat: BaseChatModel) {
		this.chat = chat;
		this.history = new InMemoryChatMessageHistory();
		this.chatWithHistory = new RunnableWithMessageHistory({
			runnable: chat,
			getMessageHistory: () =>  this.history
		})
	}

	public toNativePrompt(assets: GenericAsset[]): any {
		return assets.map(asset => {
			const content = asset.mimeType === 'text/plain'
				? asset.data.toString()
				: [{
					type: 'image_url',
					image_url: `data:${asset.mimeType},base64;${asset.data.toString('base64')}`
				}];
			return new HumanMessage({ content });
		});
	}

	public async call(nativePrompt: any, ragPrompt?: any): Promise<Answer> {
		const result = await this.chat.invoke([...nativePrompt, ...ragPrompt]);
		return {
			type: 'text',
			data: result.content as string
		}
	}
	public async send(nativePrompt: any, ragPrompt?: any): Promise<Answer> {
		const result =
			await this.chatWithHistory.invoke([...nativePrompt, ...ragPrompt]);
		return {
			type: 'text',
			data: result.content
		}
	}

	public static for({ service }: AIChatParams) {
		let chat: BaseChatModel;
		switch (service) {
			case 'gemini':
				chat = new ChatGoogleGenerativeAI({ model: 'gemini-1.5-flash' });
				break;
		}

		return new AIChat(chat)
	}
}