import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FieldError, translateError } from '../../services/validators';
import useTranslator from '../../hooks/useTranslator';

interface Props {
	role: string;
	value: boolean;
	label: string;
	setValue: (value: boolean) => void;
	error?: FieldError;
}

const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
	},
}));

export default function CheckboxField({ value, label, setValue, error }: Props) {
	const classes = useStyles();
	const t = useTranslator();
	const errorMessage = error ? translateError(error, t) : undefined;
	return (
		<div>
			<FormControlLabel control={<Checkbox checked={value} onChange={handleChange} />} label={label} />
			<span className={classes.error}>{errorMessage}</span>
		</div>
	);

	function handleChange(event) {
		setValue(event.target.checked);
	}
}
