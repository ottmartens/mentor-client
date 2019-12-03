import React from 'react';
import { UserRole } from '../types';

export interface UserContextValue {
	user: UserContextUser | null;
	setUser: React.Dispatch<React.SetStateAction<UserContextUser | null>>;
}

export type UserContextUser = { id: number; name: string; imageUrl: string; token: string; role: UserRole ; groupId: number; isVerified: boolean;};

export const UserContext = React.createContext<UserContextValue | null>(null);
