import type { RequestHandler } from '@sveltejs/kit';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { sentry } from '@hono/sentry';
import basicApi from '@/router/basicApi';
import { defaultErrorHandler } from '@/handlers/errorHandler';
import { getFileByGlobalIdentifier, getFileByKeySchema } from '@/handlers/fileHandler';

const app = new Hono();

if (process.env['SENTRY_DSN'] && process.env['SENTRY_DSN'] !== '') {
	app.use(
		'/api',
		sentry({
			dsn: process.env['SENTRY_DSN'],
			environment: process.env.NODE_ENV
		})
	);
}

if (process.env.NODE_ENV === 'development') {
	app.use(logger());
}

app
	.onError(defaultErrorHandler)
	// globalIdentifier can be with extension file {globalIdentifier}.{format} or normal
	.get('/f/:globalIdentifier', getFileByGlobalIdentifier)
	// key can be Id(File) or identifier, key can be with extension file {key}.{format} or normal
	.get('/f/:appId/:key', getFileByKeySchema)
	.basePath('/api')
	.route('/', basicApi);

export const GET: RequestHandler = ({ request }) => app.fetch(request);
export const POST: RequestHandler = ({ request }) => app.fetch(request);
