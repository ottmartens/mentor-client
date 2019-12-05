import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useTranslator from '../../hooks/useTranslator';
import { translateError, FieldError } from '../../services/validators';

interface Option {
	value: string;
	label: string;
}

interface Props {
	formLabel?: string;
	value: string | undefined;
	setValue: (newValue: string) => void;
	options: Option[];
	isColumn: boolean;
	error?: FieldError;
}

const useStyles = makeStyles((theme) => ({
	group: {
		flexDirection: 'row',
	},
	columnGroup: {
		flexDirection: 'column',
	},
	error: {
		display: 'block',
		color: '#f00',
		textAlign: 'left',
	},
}));

export default function RadioButtonField({ formLabel, value, options, setValue, isColumn, error }: Props) {
	const classes = useStyles();
	const t = useTranslator();
	const errorMessage = error ? translateError(error, t) : undefined;
	return (
		<FormControl component="fieldset">
			<FormLabel component="legend">{formLabel}</FormLabel>
			<RadioGroup
				value={value || options[0].value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				className={isColumn ? classes.columnGroup : classes.group}
			>
				{options.map((opt, idx) => {
					return <FormControlLabel key={idx} value={opt.value} control={<Radio />} label={opt.label} />;
				})}
			</RadioGroup>
			<span className={classes.error}>{errorMessage}</span>
		</FormControl>
	);
}
