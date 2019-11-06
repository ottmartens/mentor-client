const tokenName = 'mentorAppUserToken';

export function setUserToken(token: string) {
	localStorage.setItem(tokenName, token);
	return true;
}

export function removeUserToken() {
	localStorage.removeItem(tokenName);
	return true;
}

export function getUserToken() {
	return localStorage.getItem(tokenName);
}
