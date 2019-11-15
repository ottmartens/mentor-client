import React from 'react';
import { UserRole } from '../types';

export interface UserContextValue {
	user: UserContextUser | null;
	setUser: React.Dispatch<React.SetStateAction<UserContextUser | null>>;
}

export type UserContextUser = { name: string; imageUrl: string; token: string; role: UserRole };

export const UserContext = React.createContext<UserContextValue | null>(null);
