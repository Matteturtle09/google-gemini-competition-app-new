import { NextRequest } from 'next/server'

export function getCookie(req: NextRequest, name: string, ifNull: string = ''): string {
	return req.cookies.get(name)?.value || ifNull;
}