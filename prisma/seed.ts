import { createBcrypt } from '../src/helpers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const admin = await prisma.user.upsert({
		where: { email: process.env.EMAIL ?? 'email@mail.com' },
		update: {
			name: process.env.NAME ?? 'name',
			password: createBcrypt(process.env.PASSWORD ?? 'password')
		},
		create: {
			email: process.env.EMAIL ?? 'email@mail.com',
			name: process.env.NAME ?? 'name',
			password: createBcrypt(process.env.PASSWORD ?? 'password'),
			isSuperUser: true
		}
	});

	const client = await prisma.client.upsert({
		where: { session: 'default' },
		update: {},
		create: {
			userId: admin.id,
			name: 'Default Client',
			session: 'default'
		}
	});

	const application = await prisma.application.upsert({
		where: { secretKey: 'default' },
		update: {},
		create: {
			userId: admin.id,
			clientId: client.id,
			name: 'Default Application',
			publicKey: 'default',
			secretKey: 'default',
			teleGroupId: 'default'
		}
	});

	console.log({ admin, client, application });
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
