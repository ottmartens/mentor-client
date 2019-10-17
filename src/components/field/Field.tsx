import React from 'react';
import { TextField } from '@material-ui/core';
import { FieldError } from '../../services/validators';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

interface Props {
	type?: 'text' | 'password';
	label: string;
	setValue: (value: string) => void;
	value: string | undefined;
	error: FieldError | undefined;
}

const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
	},
}));

export default function Field({ label, type, setValue, value, error }: Props) {
	const classes = useStyles();
	return (
		<>
			<TextField
				label={label}
				type={type}
				value={value || ''}
				onChange={handleChange}
				margin="normal"
				variant="outlined"
				error={!!error}
			/>
			<span className={classes.error}>{error}</span>
		</>
	);

	function handleChange(event) {
		setValue(event.target.value);
	}
}
