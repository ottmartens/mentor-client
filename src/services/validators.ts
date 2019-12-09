import { UseInput } from '../hooks/useInput';
import { Translation } from '../translations';
import assertNever from './assertNever';

export enum FieldError {
	NOT_SET = 'NOT_SET',
	NOT_EMAIL = 'NOT_EMAIL',
	PASSWORD_NOT_EQUAL = 'PASSWORD_NOT_EQUAL',
}
export type ValidatorFn = (value: any) => FieldError | boolean;

export function isSet(value: any): FieldError | boolean {
	if (value !== 0 && !value) {
		return FieldError.NOT_SET;
	}

	return true;
}

export function isEmail(value: any): FieldError | boolean {
	/* eslint-disable no-useless-escape */
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	/* eslint-enable no-useless-escape */

	if (!re.test(value)) {
		return FieldError.NOT_EMAIL;
	}

	return true;
}

export const isPasswordEqual = (otherValue: string | undefined) => (value: string | undefined) => {
	if (value !== otherValue) {
		return FieldError.PASSWORD_NOT_EQUAL;
	}
	return true;
};

export function validateInputs(input: { [s: string]: UseInput }) {
	const inputsArray: UseInput[] = [...Object.values<UseInput>(input)];
	const validationResult = inputsArray.map((input) => input.validate());
	if (validationResult.find((error) => error !== undefined)) {
		return false;
	}
	return true;
}

export function translateError(error: FieldError, t: (t: Translation) => string) {
	switch (error) {
		case FieldError.NOT_EMAIL:
			return `${t(Translation.VALIDATOR_NOT_EMAIL)}`;
		case FieldError.NOT_SET:
			return `${t(Translation.VALIDATOR_NOT_SET)}`;
		case FieldError.PASSWORD_NOT_EQUAL:
			return `${t(Translation.VALIDATOR_PASSWORD_NOT_EQUAL)}`;
		default:
			assertNever(error);
	}
}
