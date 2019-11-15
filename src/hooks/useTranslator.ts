import { TRANSLATIONS, Translation } from '../translations';

export enum Language {
	EE = 'EE',
	EN = 'EN',
}

export default function useTranslator(): (t: Translation) => string {
	let selectedLanguage = localStorage.getItem('lang') || Language.EE;

	if (!localStorage.getItem('lang')) {
		localStorage.setItem('lang', selectedLanguage);
	}

	const translator = (translation: Translation) => {
		return TRANSLATIONS[selectedLanguage][translation];
	};

	return translator;
}
