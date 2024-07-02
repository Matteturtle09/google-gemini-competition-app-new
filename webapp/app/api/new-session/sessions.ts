import { AIModel, InputType } from '../bot/ai-model'
import { createGeminiSession } from '../bot/gemini-ai-model'
import { randomUUID } from 'crypto'

export const enum Service {
	GEMINI
}
export type NewSessionRequest = {
	service: Service;
	apiKey: string;
	orgID: string;
}
export interface Session {
	readonly id: string;

	model(name: string): AIModel;
	modelFor(type: InputType): AIModel;
}


let sessions: Map<string, Session>;

export function getSession(id: string): Session | null {
	return sessions.get(id) || null;
}
export function closeSession(id: string): boolean {
	return sessions.delete(id);
}
export function openSession(req: NewSessionRequest): Session {
	// create UUID
	let id: string;
	while (sessions.has(id = randomUUID())) { }

	// create the session based on the service
	let session: Session;
	switch (req.service) {
		case Service.GEMINI: session = createGeminiSession(id, req.apiKey); break;
	}

	// add the session to the pool
	sessions.set(session.id, session);
	return session;
}