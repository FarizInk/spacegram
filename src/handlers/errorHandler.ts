import type { Context } from 'hono';

export const defaultErrorHandler = (err: Error, c: Context) => {
	return c.json(
		{
			message: `${err}`
		},
		500
	);
};
