import { NextRequest, NextResponse } from 'next/server';
import { openSession } from '../../../../lib/session/sessions'
import { SessionConfig } from '../../../../lib/session/Session'

export async function POST(req: NextRequest) {
	const config = await req.json() as SessionConfig;
	const session = openSession(config);

	const res = new NextResponse();
	res.cookies.set('session-id', session.id);
	return res;
}