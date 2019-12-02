import 'date-fns';
import React from 'react';
import { FieldError } from '../../services/validators';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';

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
	return (
		<>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<KeyboardDatePicker
					className={className}
					disableToolbar
					variant="inline"
					format="dd/MM/yyyy"
					margin="normal"
					label={label}
					value={value || new Date()}
					inputVariant="outlined"
					disableFuture
					onChange={handleDateChange}
				/>
			</MuiPickersUtilsProvider>
			<span className={classes.error}>{error}</span>
		</>
	);
	function handleDateChange(date) {
		setValue(date);
	}
}
