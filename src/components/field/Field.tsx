import React from 'react';
import { TextField } from '@material-ui/core';
import { FieldError } from '../../services/validators';
import { makeStyles } from '@material-ui/styles';

interface Props {
	type?: 'text' | 'password';
	label: string;
	setValue: (value: string) => void;
	value: string | undefined;
	error: FieldError | undefined;
	multiline?: boolean;
	className?: string;
	disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
	},
}));

export default function Field({ label, type, setValue, value, error, className, multiline, disabled }: Props) {
	const classes = useStyles();
	return (
		<>
			<TextField
				disabled={disabled}
				label={label}
				type={type}
				value={value || ''}
				onChange={handleChange}
				margin="normal"
				variant="outlined"
				error={!!error}
				className={className}
				multiline={multiline}
				rows={multiline ? 8 : undefined}
			/>
			<span className={classes.error}>{error}</span>
		</>
	);

	function handleChange(event) {
		setValue(event.target.value);
	}
}
