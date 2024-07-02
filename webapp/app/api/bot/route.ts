import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../new-session/sessions';
import { Prompt, InputType } from './ai-model'
import { getCookie } from '../utils'


export async function POST(req: NextRequest) {
	const prompt = await req.json() as Prompt;

	// get the session from the pool
	const id = getCookie(req, 'session-id');
	const session = getSession(id);
	if (session === null) throw new Error('invalid session');

	// get the model and run it
	const answer = await session
		.modelFor(InputType.TEXT)
		.run(prompt);

	return NextResponse.json(answer);
}