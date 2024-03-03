import { NODE_ENV } from '$env/static/private';
import { createTicket } from '@/actions/ticket';
import {
	checkIdentifier,
	createBcrypt,
	createGlobalIdentifier,
	getAppByQuery,
	getRequestBody,
	prisma
} from '@/utils';
import { saveFile } from '@/utils/filesystem';
import { generate } from '@/utils/format';
import { connect } from '@/utils/telegram';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const getTicket = async (c: Context) => {
	const application = await getAppByQuery(c.req.query());

	if (application) {
		const ticket = await createTicket(application.id);
		// FUTURE: how to simple this decission when using typescript interface?
		if (NODE_ENV === 'development') {
			return c.json({
				ticket: ticket.id,
				application: application.name,
				token: createBcrypt(ticket.id + application.secretKey)
			});
		}
		return c.json({
			ticket: ticket.id,
			application: application.name
		});
	} else {
		throw new Error('Application not Found');
	}
};

export const storeFile = async (c: Context) => {
	const body = await getRequestBody(c);

	if (!body.content) {
		throw new HTTPException(403, { message: 'Content must be filled' });
	}

	const permission = body.permission ?? 'public';
	const application = await getAppByQuery(c.req.query());
	if (!application.groupId) {
		throw new HTTPException(403, { message: "Your application doesn't have groupId." });
	}

	if (body.identifier) {
		await checkIdentifier(body.identifier, application);
	}

	let file = await prisma.file.create({
		data: { applicationId: application.id, permission: permission, groupId: application.groupId }
	});
	const identifier = body.identifier ?? file.id;

	const { path, extension, type } = await saveFile(body.content, file.id, application);

	file = await prisma.file.update({
		where: { id: file.id },
		data: { extensionType: type, extension, identifier, isCached: true }
	});

	const client = await connect(application);
	const chat = await client.sendFile(application.groupId, {
		caption: generate({
			id: file.id,
			identifier,
			type,
			extension,
			permission
		}),
		file: path,
		forceDocument: true,
		progressCallback: (progress) => {
			console.log(progress);
		}
	});

	file = await prisma.file.update({
		where: { id: file.id },
		data: { isUploaded: true, chatId: chat.id.toString() }
	});

	await client.disconnect();
	await client.destroy();

	file = await createGlobalIdentifier(identifier, file);

	return c.json({ file });
};

export const updateFile = async (c: Context) => {
	return c.text('soon');
};

export const deleteFile = async (c: Context) => {
	return c.text('soon');
};
