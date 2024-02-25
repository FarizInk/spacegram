import { createTicket } from '@/actions/ticket';
import { prisma, prismaExclude } from '@/helpers';
import type { Context } from 'hono';

export const getTicket = async (c: Context) => {
	const query = c.req.query();
	const application = await prisma.application.findFirst({
		where: {
			publicKey: query.key ?? 'default'
		}
	});

	if (application) {
		return c.json({
			ticket: await createTicket(application.id),
			application: prismaExclude(application, ['secretKey', 'publicKey', 'teleGroupId'])
		});
	} else {
		throw new Error('Application not Found');
	}
};

export const storeFile = async (c: Context) => {
	return c.json({
		data: null
	});
};

export const updateFile = async (c: Context) => {
	return c.json({
		data: null
	});
};

export const deleteFile = async (c: Context) => {
	return c.json({
		data: null
	});
};
