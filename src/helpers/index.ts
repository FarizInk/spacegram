import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { Application, User } from '@prisma/client';

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

export const saveFile = () => {};
