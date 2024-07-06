// ISO date type
// In TS, interfaces are "open" and can be extended

type TYear = `${number}${number}${number}${number}`;
type TMonth = `${number}${number}`;
type TDay = `${number}${number}`;
type THours = `${number}${number}`;
type TMinutes = `${number}${number}`;
type TSeconds = `${number}${number}`;
type TMilliseconds = `${number}${number}${number}`;

/**
 * Represent a string like `2021-01-08`
 */
type TDateISODate = `${TYear}-${TMonth}-${TDay}`;

/**
 * Represent a string like `14:42:34.678`
 */
type TDateISOTime = `${THours}:${TMinutes}:${TSeconds}.${TMilliseconds}`;

/**
 * Represent a string like `2021-01-08T14:42:34.678Z` (format: ISO 8601).
 *
 * It is not possible to type more precisely (list every possible values for months, hours etc) as
 * it would result in a warning from TypeScript:
 *   "Expression produces a union type that is too complex to represent. ts(2590)
 */
type TDateISO = `${TDateISODate}T${TDateISOTime}Z`;

// Message type
export type Message = {
  content: string,
  sender: string,
  date: TDateISO,
}

export type DataSource = {
  hostedFiles: { id: string | number , fileName: string, size: string, src: string, metadata?: any}[],
}

// BotSettings type

export type BotSettings = {
  name: string,
  site: string,
  description: string,
  datasource: DataSource,
}

// PDF extracted data
export type TableRow = {
	data: string[];
}
export type Table = {
	header: string[];
	rows: TableRow[];
}
export type TableAsset = {
	table: Table;
	image: ImageAsset;
}
export type PDF = {
	images: ImageAsset[];
	tables: TableAsset[];
	layout: any;
}

// Mime types for gemini input files
export type ImageMimeType =
	| 'image/png'
	| 'image/jpeg'
	| 'image/webp'
	| 'image/heic'
	| 'image/heif';
export type VideoMimeType =
	| 'video/mp4'
	| 'video/mpeg'
	| 'video/mov'
	| 'video/avi'
	| 'video/x - flv'
	| 'video/mpg'
	| 'video/webm'
	| 'video/wmv'
	| 'video/3gpp';
export type FileAsset<MT> = {
	readonly data: Buffer;
	readonly mimeType: MT;
}
export type ImageAsset = FileAsset<ImageMimeType>;
export type VideoAsset = FileAsset<VideoMimeType>;

// types for ai prompting
export type InputType = 'text' | 'image' | 'text-image' | 'pdf';
export type Prompt = Array<string | ImageAsset | VideoAsset>;
export type Answer = {
	type: 'text' | 'json';
	data: string;
}
export type Embedding = {
	values: number[];
}

// generic ai model interface
export interface AIModel {
	generate(prompt: Prompt): Promise<Answer>;
	embed(prompt: Prompt): Promise<Embedding>;
}
