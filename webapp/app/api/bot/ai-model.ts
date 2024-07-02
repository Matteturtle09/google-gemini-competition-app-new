export type Prompt = {
	text?: string;
	image?: string;
}
export type Answer = {
	text: string;
}

export const enum InputType {
	TEXT = 'text',
	IMAGE = 'image',
	TEXT_IMAGE = 'text-image'
}

export interface AIModel {
	run(req: Prompt): Promise<Answer>;
}