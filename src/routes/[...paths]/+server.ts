import type { RequestHandler } from '@sveltejs/kit';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { SENTRY_DSN, NODE_ENV } from '$env/static/private';
import { sentry } from '@hono/sentry';
import { deleteFile, getTicket, storeFile, updateFile } from '@/handlers/basicHandler';

const app = new Hono().basePath('/api');

if (SENTRY_DSN && SENTRY_DSN !== '') {
	app.use(
		'*',
		sentry({
			dsn: SENTRY_DSN,
			environment: NODE_ENV
		})
	);
}

if (NODE_ENV === 'development') {
	app.use(logger());
}

app
	.onError((err, c) => {
		return c.json(
			{
				message: `${err}`
			},
			500
		);
	})
	.get('/hello', (c) => {
		return c.json({
			message: 'Hello from hono!'
		});
	})
	.get('/ticket', getTicket)
	.post('/store', storeFile)
	.post('/update/:identifier', updateFile)
	.delete('/delete/:identifier', deleteFile);

export const GET: RequestHandler = ({ request }) => app.fetch(request);
export const POST: RequestHandler = ({ request }) => app.fetch(request);
