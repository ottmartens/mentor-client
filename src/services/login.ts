export function login(user) {
	console.log(user);
	try {
		localStorage.setItem('mentorAppUser', JSON.stringify(user));
		return true;
	} catch {
		return false;
	}
}
