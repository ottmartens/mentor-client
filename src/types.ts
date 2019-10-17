export enum UserRole {
	MENTOR = 'MENTOR',
	MENTEE = 'MENTEE',
	ADMIN = 'ADMIN',
}

export interface HasUserProps {
	user: User;
}

export type User = {
	CreatedAt: Date;
	DeletedAt: null | Date;
	ID: number;
	UpdatedAt: Date;
	email: string;
	firstName: string;
	groupId: number;
	imageUrl: string;
	lastName: string;
	password: string;
	role: UserRole;
	token: string;
};
