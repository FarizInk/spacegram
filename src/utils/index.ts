import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { Application, File, User } from '@prisma/client';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';

export const prisma = new PrismaClient();

export const createBcrypt = (key: string) => bcrypt.hashSync(key, 10);

export const generateKey = async (type: string = 'public', clientId: string) => {
	const date = new Date();
	const key: string = createBcrypt(
		date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ' ' + clientId
	);

	const count = await prisma.application.count({
		where: {
			publicKey: type === 'public' ? key : undefined,
			secretKey: type === 'secret' ? key : undefined
		}
	});

	if (count >= 1) {
		await generateKey(type, clientId);
	}

	return key;
};

// Exclude keys from user
export const prismaExclude = (data: Application | User, keys: Array<string>) => {
	return Object.fromEntries(Object.entries(data).filter(([key]) => !keys.includes(key)));
};

export const getAppByQuery = async (query: { key?: string }) => {
	const application = await prisma.application.findFirst({
		where: { publicKey: query.key ?? 'default' },
		include: { client: true }
	});
	if (!application) {
		throw new HTTPException(401, { message: 'Application not Found.' });
	}
	return application;
};

export const getRequestBody = async (c: Context) =>
	c.req.header('content-type') === 'application/json'
		? await c.req.json()
		: await c.req.parseBody();

export const checkIdentifier = async (identifier: string, application: Application) => {
	const file = await prisma.file.findFirst({
		where: { identifier, applicationId: application.id, groupId: application.groupId }
	});
	if (file) {
		throw new HTTPException(401, { message: 'Identifier has been taken.' });
	}
};

// FUTURE: change {identifier}-{number} to {identifier}-{rand 4 char}
export const createGlobalIdentifier = async (identifier: string, file: File) => {
	let count = 0;
	let checkFile = null;
	do {
		let globalIdentifier = identifier;
		if (count >= 1) {
			globalIdentifier = identifier + '-' + count;
		}
		checkFile = await prisma.file.findFirst({
			where: { globalIdentifier }
		});
		if (checkFile) {
			count++;
		}
	} while (checkFile);

	if (count >= 1) {
		identifier = identifier + '-' + count;
	}

	return await prisma.file.update({
		where: { id: file.id },
		data: { globalIdentifier: identifier }
	});
};
