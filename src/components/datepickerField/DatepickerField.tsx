import 'date-fns';
import React from 'react';
import { FieldError, translateError } from '../../services/validators';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
import useTranslator from '../../hooks/useTranslator';

interface Props {
	label: string;
	setValue: (value: string) => void;
	value: string | undefined;
	error: FieldError | undefined;
	className?: string;
}

const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
	},
}));

export default function DatepickerField({ error, label, value, setValue, className }: Props) {
	const classes = useStyles();
	const t = useTranslator();
	const errorMessage = error ? translateError(error, t) : undefined;
	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<KeyboardDatePicker
				className={className}
				disableToolbar
				variant="inline"
				format="dd/MM/yyyy"
				margin="normal"
				label={label}
				value={value || ''}
				inputVariant="outlined"
				disableFuture
				onChange={handleDateChange}
			/>
			<span className={classes.error}>{errorMessage}</span>
		</MuiPickersUtilsProvider>
	);
	function handleDateChange(date) {
		setValue(date);
	}
}
