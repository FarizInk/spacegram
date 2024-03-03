import { deleteExpiredTicket } from '@/actions/ticket';
import { getAppByQuery, getRequestBody, prisma } from '@/utils';
import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import bcrypt from 'bcrypt';
import type { Application } from '@prisma/client';

const ticketAuth = async (application: Application, token: string) => {
	const tickets = await prisma.ticket.findMany({
		where: {
			successAt: null
		}
	});

	let ticket = null;
	if (application?.secretKey) {
		for (let i = 0; i < tickets.length; i++) {
			const identifier = tickets[i].id;
			const result = bcrypt.compareSync(identifier + application.secretKey, token);
			if (result) {
				ticket = identifier;
				break;
			}
		}
	}
	if (ticket === null) {
		throw new HTTPException(401, { message: 'Ticket Expired.' });
	}
};

export const defaultAuthMiddleware = async (c: Context, next: Next) => {
	// idk why next handler can't get request body when not get request body in here (the request not error but have infinite loading)
	await getRequestBody(c);
	const authorization = c.req.header('authorization');

	if (!authorization) {
		throw new HTTPException(401, { message: 'Unathorized' });
	}
	deleteExpiredTicket();

	const token = authorization.replace('Bearer ', '');
	const application = await getAppByQuery(c.req.query());
	await ticketAuth(application, token);

	await next();
};
