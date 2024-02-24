import type { RequestHandler } from '@sveltejs/kit';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { SENTRY_DSN } from '$env/static/private';
import { sentry } from '@hono/sentry';
import { createTicket } from '@/actions/ticket';

const app = new Hono().basePath('/api');

if (SENTRY_DSN && SENTRY_DSN !== '') {
	app.use(
		sentry({
			dsn: SENTRY_DSN
		})
	);
}

app
	.use(logger())
	.get('/hello', (c) => {
		return c.json({
			message: 'Hello from hono!'
		});
	})
	.get('/ticket', async (c) => {
		return c.json({
			ticket: await createTicket()
		});
	});

export const GET: RequestHandler = ({ request }) => app.fetch(request);
export const POST: RequestHandler = ({ request }) => app.fetch(request);
