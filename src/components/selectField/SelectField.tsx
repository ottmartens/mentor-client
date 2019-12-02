import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { FieldError } from '../../services/validators';
import { makeStyles } from '@material-ui/styles';

interface Option {
	value: string;
	label: string;
}

interface Props {
	label: string;
	setValue: (value: string | string[]) => void;
	value: string | string[] | undefined;
	error: FieldError | undefined;
	className?: string;
	disabled?: boolean;
	labelWidth?: number;
	options: Option[];
	multiple?: boolean;
}

const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
	},
}));

export default function SelectField({
	label,
	setValue,
	value,
	error,
	className,
	disabled,
	options,
	labelWidth,
	multiple = false,
}: Props) {
	const classes = useStyles();
	return (
		<FormControl variant="outlined" className={className}>
			<InputLabel>{label}</InputLabel>
			<Select
				value={value}
				onChange={handleChange}
				disabled={disabled}
				labelWidth={labelWidth}
				style={{ textAlign: 'left' }}
				multiple={multiple}
			>
				{options.map(({ value, label }) => (
					<MenuItem value={value}>{label}</MenuItem>
				))}
			</Select>
			<span className={classes.error}>{error}</span>
		</FormControl>
	);

	function handleChange(event) {
		setValue(event.target.value);
	}
}
