import { UseInput } from '../hooks/useInput';

export enum FieldError {
	NOT_SET = 'This field is required',
	NOT_EMAIL = 'Email address is invalid',
}
export type ValidatorFn = (value: any) => FieldError | boolean;

export function isSet(value: any): FieldError | boolean {
	if (value !== 0 && !value) {
		return FieldError.NOT_SET;
	}

	return true;
}

export function isEmail(value: any): FieldError | boolean {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!re.test(value)) {
		return FieldError.NOT_EMAIL;
	}

	return true;
}

export function validateInputs(input: { [s: string]: UseInput }) {
	const inputsArray: UseInput[] = [...Object.values<UseInput>(input)];
	const validationResult = inputsArray.map((input) => input.validate());
	if (validationResult.find((error) => error !== undefined)) {
		return false;
	}
	return true;
}
