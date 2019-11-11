import { TRANSLATIONS, TranslationValue } from '../translations';

export enum Language {
	EE = 'EE',
	EN = 'EN',
}

export default function useTranslator(): { [key in TranslationValue]: string } {
	let selectedLanguage = localStorage.getItem('lang');

	if (!selectedLanguage) {
		selectedLanguage = Language.EE;
		localStorage.setItem('lang', Language.EE);
	}
	return TRANSLATIONS[selectedLanguage];
}
