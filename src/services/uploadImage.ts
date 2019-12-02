import axios from 'axios';
import { BASE_URL, queryPrefix } from './variables';

export async function uploadImage(file: File, userAuth: string): Promise<any> {
	var formData = new FormData();
	formData.append('file', file);
	return axios({
		method: 'post',
		url: `${BASE_URL}${queryPrefix}/user/image`,
		data: formData,
		headers: { 'Content-Type': 'multipart/form-data', Authorization: userAuth },
	}).catch((err) => {
		throw new Error(err);
	});
}
export function validateSize(file, size: number): boolean {
	var FileSize = file.size / 1024 / 1024; // in MB
	if (FileSize > size) {
		return false;
	}
	return true;
}

// setImagePreview(URL.createObjectURL(file));
