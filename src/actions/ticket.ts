import { ulid } from 'ulid';
import { prisma } from '@/helpers';

export const createTicket = async (applicationId: string | undefined = undefined) => {
	const ticketId = ulid();

	await prisma.ticket.create({
		data: {
			value: ticketId,
			applicationId
		}
	});

	return ticketId;
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
			executedAt: null
		}
	});
};
