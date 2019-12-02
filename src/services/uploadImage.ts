import axios from 'axios';
import { BASE_URL } from './variables';

export async function uploadImage(file: File, url: string, userAuth: string): Promise<any> {
	var formData = new FormData();
	formData.append('file', file);
	return axios({
		method: 'post',
		url: `${BASE_URL}${url}`,
		data: formData,
		headers: { 'Content-Type': 'multipart/form-data', Authorization: userAuth },
	}).catch((err) => {
		throw new Error(err);
	});
}
export function validateImage(file, size?: number): string | undefined {
	var FileSize = file.size / 1024 / 1024; // in MB

	if (!isFileImage(file)) {
		return 'Selected file is not an image';
	}

	if (size && FileSize > size) {
		return `Selected image exceeds ${size} mb of size`;
	}

	return undefined;
}

function isFileImage(file) {
	return file && file['type'].split('/')[0] === 'image';
}
