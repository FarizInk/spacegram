import { prisma } from '@/utils';

export const createTicket = async (applicationId: string | undefined = undefined) => {
	const ticket = await prisma.ticket.create({
		data: {
			applicationId
		}
	});

	await deleteExpiredTicket();

	return ticket;
};

// Delete expired ticket (less than 1 day ago && not executed)
export const deleteExpiredTicket = async () => {
	const date = new Date();
	date.setDate(date.getDate() - 1);

	await prisma.ticket.deleteMany({
		where: {
			createdAt: {
				lte: date.toISOString()
			},
			successAt: null
		}
	});
};
