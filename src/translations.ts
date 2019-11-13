import { Language } from './hooks/useTranslator';

export enum Translation {
	LOGIN = 'LOGIN',
	PASSWORD = 'PASSWORD',
}
// ts-ignore
export const TRANSLATIONS: { [key in Language]: { [key in Translation]: string } } = {
	EE: {
		LOGIN: 'Logi sisse',
		PASSWORD: 'Parool',
	},
	EN: {
		LOGIN: 'Login',
		PASSWORD: 'Password',
	},
};
