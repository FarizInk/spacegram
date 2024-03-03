import { deleteFile, getTicket, storeFile, updateFile } from '@/handlers/basicHandler';
import { defaultAuthMiddleware } from '@/handlers/middlewareHandler';
import { Hono } from 'hono';

export default new Hono()
	.get('/ticket', getTicket)
	.post('/store', defaultAuthMiddleware, storeFile)
	.post('/update/:id', defaultAuthMiddleware, updateFile)
	.delete('/delete/:id', defaultAuthMiddleware, deleteFile);
