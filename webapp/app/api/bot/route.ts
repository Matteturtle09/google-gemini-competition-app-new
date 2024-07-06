import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../lib/ai-models/sessions';
import { Prompt } from '../../../lib/types'
import { getCookie } from '../../../lib/utils'
import { Database } from '../../../lib/databases/chroma/database'


export async function POST(req: NextRequest) {
	const prompt = await req.json() as Prompt;

	// get the session from the pool
	const id = getCookie(req, 'session-id');
	const session = getSession(id);
	if (session === undefined) throw new Error('invalid session');

	// get the model and run it
	const answer = await session
		.modelFor('text')
		.generate(prompt);

	const embedding = await session
		.modelFor('text')
		.embed(prompt);

	const db = Database.get('');
	db.upload(embedding);

	return NextResponse.json(answer);
}