import { randomUUID } from 'crypto'
import { AIModel, InputType } from '../bot/ai-model'
import { newGeminiSession } from '../bot/gemini-ai-model'

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

export function getSession(id: string): Session | undefined {
	return sessions.get(id);
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
		case Service.GEMINI:
			session = newGeminiSession(id, req.apiKey);
			break;
	}

	// add the session to the pool
	sessions.set(session.id, session);
	return session;
}