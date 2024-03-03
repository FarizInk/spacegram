import { API_HASH, API_ID } from '$env/static/private';
import type { Prisma } from '@prisma/client';
import { HTTPException } from 'hono/http-exception';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export type ApplicationWithClient = Prisma.ApplicationGetPayload<{
	include: { client: true };
}>;

export const connect = async (application: ApplicationWithClient) => {
	const client = new TelegramClient(
		new StringSession(application.client.session),
		parseInt(API_ID),
		API_HASH,
		{ connectionRetries: 5 }
	);

	if (!client) {
		throw new HTTPException(403, { message: "Client can't connect." });
	}

	await client.connect();

	return client;
};

export const getMessage = async (
	application: ApplicationWithClient,
	id: number,
	cl: TelegramClient | undefined
) => {
	const client = cl ?? (await connect(application));
	const messages = await client.getMessages(application.groupId, { ids: [id] });

	if (messages.length >= 1) {
		return messages[0];
	}
	return null;
};
