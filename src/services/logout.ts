export function logout() {
	const loggedInUser = localStorage.getItem('mentorAppUser');
	if (!loggedInUser) {
		return false;
	}
	localStorage.removeItem('mentorAppUser');
	return true;
}
