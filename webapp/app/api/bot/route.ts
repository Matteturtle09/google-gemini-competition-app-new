import { NextRequest, NextResponse } from 'next/server';
import { Prompt } from '../../../lib/ai-model/assets';
import { getCookie } from '../../../lib/utils'
import { getSession, closeSession } from '../../../lib/session/sessions'

export async function POST(req: NextRequest) {
	const prompt = await req.json() as Prompt;

	const id = getCookie(req, 'session-id');
	const session = getSession(id);
	if (session === undefined) throw new Error('invalid session');

	const answer = await session.handle(prompt);
	return NextResponse.json(answer);
}

export async function DELETE(req: NextRequest) {
	const id = await req.text();
	const success = closeSession(id);
	const status = success ? 200 : 500;
	return new NextResponse(null, {
		headers: {
			'session-id': id
		},
		status
	});
}