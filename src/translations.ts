import { Language } from './hooks/useTranslator';

export enum TranslationValue {
	LOGIN = 'LOGIN',
	PASSWORD = 'PASSWORD',
}
// ts-ignore
export const TRANSLATIONS: { [key in Language]: { [key in TranslationValue]: string } } = {
	EE: {
		LOGIN: 'Logi sisse',
		PASSWORD: 'Parool',
	},
	EN: {
		LOGIN: 'Login',
		PASSWORD: 'Password',
	},
};
