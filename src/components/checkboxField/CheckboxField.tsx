import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FieldError, translateError } from '../../services/validators';
import useTranslator from '../../hooks/useTranslator';

interface Props {
	value: boolean;
	label: string;
	setValue: (value: string) => void;
	error?: FieldError;
}

const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
	},
}));

export default function Field({ value, label, setValue, error }: Props) {
	const classes = useStyles();
	const t = useTranslator();
	const errorMessage = error ? translateError(error, t) : undefined;
	return (
		<div>
			<FormControlLabel value={value || ''} control={<Checkbox onChange={handleChange} />} label={label} />
			<span className={classes.error}>{errorMessage}</span>
		</div>
	);

	function handleChange(event) {
		setValue(event.target.value);
	}
}
