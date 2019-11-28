import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

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
}

const useStyles = makeStyles((theme) => ({
	group: {
		flexDirection: 'row',
	},
	columnGroup: {
		flexDirection: 'column',
	},
}));

export default function RadioButtonField({ formLabel, value, options, setValue, isColumn }: Props) {
	const classes = useStyles();
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
		</FormControl>
	);
}
