export type AssetMimeType = {
	text: 'text/plain';
	image: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/heic' | 'image/heif';
	video:
	| 'video/mp4'
	| 'video/mpeg'
	| 'video/mov'
	| 'video/avi'
	| 'video/x-flv'
	| 'video/mpg'
	| 'video/webm'
	| 'video/wmv'
	| 'video/3gpp';
}
export type DocMimeType = 'application/pdf';
type AssetBase<MT> = {
	data: Buffer;
	mimeType: MT;
}
export type TextAsset = AssetBase<AssetMimeType['text']>;
export type ImageAsset = AssetBase<AssetMimeType['image']>;
export type VideoAsset = AssetBase<AssetMimeType['video']>;

export type GenericAsset = TextAsset | ImageAsset | VideoAsset;
export type Prompt = {
	assets: GenericAsset[];
	docs: {
		index: number;
		mimeType: DocMimeType;
		data: Buffer;
	}[]
}

export type Answer = {
	type: 'text' | 'json';
	data: string;
}
export type Embedding = number[];