import { OverwriteUserInfo } from '../types';

export function login(user) {
	try {
		localStorage.setItem('mentorAppUser', JSON.stringify(user));
		return true;
	} catch {
		return false;
	}
}

export function logout() {
	const loggedInUser = localStorage.getItem('mentorAppUser');
	if (!loggedInUser) {
		return false;
	}
	localStorage.removeItem('mentorAppUser');
	return true;
}

export function parseUser() {
	try {
		const userJSON = localStorage.getItem('mentorAppUser');
		return userJSON ? JSON.parse(userJSON) : undefined;
	} catch {
		return undefined;
	}
}

export function overwriteUserInfo(props: OverwriteUserInfo) {
	const userJSON = localStorage.getItem('mentorAppUser');
	if (!userJSON) {
		return false;
	}
	const user = JSON.parse(userJSON);
	const newUser = { ...user, ...props };
	localStorage.setItem('mentorAppUser', JSON.stringify(newUser));
	return true;
}
