import { NextRequest, NextResponse } from 'next/server';
import { NewSessionRequest, openSession } from './sessions';


export async function POST(req: NextRequest) {
	const newSessionRequest = await req.json() as NewSessionRequest;
	openSession(newSessionRequest);
	return NextResponse.json({ status: 200 });
}