import React from 'react';
import { TextField } from '@material-ui/core';
import { FieldError, translateError } from '../../services/validators';
import { makeStyles } from '@material-ui/styles';
import useTranslator from '../../hooks/useTranslator';

interface Props {
	type?: 'text' | 'password' | 'number';
	label: string;
	setValue: (value: string) => void;
	value: string | undefined;
	error: FieldError | undefined;
	multiline?: boolean;
	className?: string;
	disabled?: boolean;
	name?: string;
	validate?: () => FieldError | undefined;
	testId?: string;
}

const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
		textAlign: 'left',
	},
	inputWrapper: {
		display: 'inline-block',
	},
}));

export default function Field({
	label,
	type,
	setValue,
	value,
	error,
	className,
	multiline,
	disabled,
	name,
	validate,
	testId,
	...rest
}: Props) {
	const classes = useStyles();
	const t = useTranslator();
	const errorMessage = error ? translateError(error, t) : undefined;
	return (
		<div className={classes.inputWrapper} data-testid="inputWrapper">
			<TextField
				disabled={disabled}
				label={label}
				type={type}
				name={name}
				value={value || ''}
				onChange={handleChange}
				margin="normal"
				variant="outlined"
				error={!!error}
				className={className}
				multiline={multiline}
				rows={multiline ? 8 : undefined}
				data-testid={testId}
				{...rest}
			/>
			<span className={classes.error} data-testid="inputError">
				{errorMessage}
			</span>
		</div>
	);

	function handleChange(event) {
		setValue(event.target.value);
	}
}