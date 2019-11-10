import { UserContextUser } from './contexts/UserContext';

export enum UserRole {
	MENTOR = 'MENTOR',
	MENTEE = 'MENTEE',
	ADMIN = 'ADMIN',
}

export interface HasUserProps {
	user: UserContextUser;
}
