import React from 'react';
import { ValidatorFn, FieldError } from '../services/validators';

interface Props {
	initialValue?: string | string[] | number | boolean;
	validators?: ValidatorFn[];
}

export type UseInput = {
	value: any;
	setValue: (value: any) => void;
	validate: () => FieldError | undefined;
	error: FieldError | undefined;
};

export default function useInput({ initialValue, validators }: Props = {}): UseInput {
	const [value, setStateValue] = React.useState<string | number | undefined>();
	const [error, setStateError] = React.useState<FieldError | undefined>();

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	function validate() {
		const firstError = findFirstError(validators, value);

		setStateError(firstError);

		return firstError;
	}

	function setValue(value) {
		setStateValue(value);
	}

	return { value, setValue, validate, error };
}

function findFirstError(
	validators: ValidatorFn[] | undefined,
	value: string | number | undefined,
): FieldError | undefined {
	if (!validators || validators.length === 0) {
		return undefined;
	}
	const validatorResults: (boolean | FieldError)[] = validators.map((validator) => validator(value));
	// @ts-ignore
	const error: FieldError | undefined = validatorResults.find((result) => result !== true);
	return error;
}
