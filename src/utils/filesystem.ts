import { TMP_PATH } from '$env/static/private';
import { mimes } from './mimes';
import { mkdir } from 'node:fs/promises';
import type { Application } from '@prisma/client';

export interface BlobType {
	data: Blob;
	name?: string;
	type?: string;
}

export const saveFile = async (payload: BlobType, id: string, application: Application) => {
	let data, extension, type;
	if (payload instanceof Blob) {
		data = new Uint8Array(await payload.arrayBuffer());
		type = payload.type;
		extension = mimes[type] ?? extension;
	} else {
		data = JSON.stringify(payload);
		extension = typeof payload === 'object' ? 'json' : 'txt';
		type = typeof payload === 'object' ? 'application/json' : 'text/plain';
	}
	const basePath = `${TMP_PATH}/${application.id}`;
	const filename = `${id}.${extension}`;

	await mkdir(basePath, { recursive: true });

	const path = `${basePath}/${filename}`;

	// upload to tmp folder
	await Bun.write(path, data);

	return {
		path,
		extension,
		type
	};
};
