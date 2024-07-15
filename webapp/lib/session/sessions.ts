import { UUID, randomUUID } from 'crypto';
import { Session, SessionConfig } from './Session'

const sessions = new Map<string, Session>();

export function getSession(id: string): Session | undefined {
	return sessions.get(id);
}

export function openSession(config: SessionConfig) {
	let id: UUID;
	while (sessions.has(id = randomUUID())) { }
	const session = new Session(id, config)
	sessions.set(id, session);
	return session;
}

export function closeSession(id: string): boolean {
	return sessions.delete(id);
}