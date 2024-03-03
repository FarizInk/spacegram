import type { Context } from 'hono';

export const getFileByGlobalIdentifier = async (c: Context) => {
	return c.json({
		identifier: c.req.param('globalIdentifier')
	});
};

export const getFileByKeySchema = async (c: Context) => {
	return c.json({
		appId: c.req.param('appId'),
		key: c.req.param('key')
	});
};
