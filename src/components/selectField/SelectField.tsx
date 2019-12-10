import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { FieldError, translateError } from '../../services/validators';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import useTranslator from '../../hooks/useTranslator';

export interface Option {
	value: string;
	label: string;
}

interface Props {
	label: string;
	setValue: (value: any) => void;
	value: any;
	error: FieldError | undefined;
	className?: string;
	disabled?: boolean;
	labelWidth?: number;
	options: Option[];
	multiple?: boolean;
	testId?: string;
}

const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
		textAlign: 'left',
		marginTop: '8px',
	},
	input: {
		margin: '16px auto 8px auto',
	},
	menu: {
		marginTop: '60px',
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
	testId,
	multiple = false,
}: Props) {
	const classes = useStyles();
	const t = useTranslator();
	const errorMessage = error ? translateError(error, t) : undefined;
	return (
		<>
			<FormControl variant="outlined" className={classNames(className, classes.input)}>
				<InputLabel>{label}</InputLabel>
				<Select
  					data-testid={testId}
					value={value}
					onChange={handleChange}
					disabled={disabled}
					labelWidth={labelWidth}
					style={{ textAlign: 'left' }}
					multiple={multiple}
					error={!!error}
					MenuProps={{ className: classes.menu }}
				>
					{options.map(({ value, label }) => (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					))}
				</Select>
				<span className={classes.error}>{errorMessage}</span>
			</FormControl>
		</>
	);

	function handleChange(event) {
		setValue(event.target.value);
	}
}
