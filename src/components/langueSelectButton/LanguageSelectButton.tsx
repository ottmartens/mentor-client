import React from 'react';
import { Select, MenuItem, FormControl } from '@material-ui/core';
import { Option } from '../selectField/SelectField';
import { makeStyles } from '@material-ui/styles';
import { Language } from '../../hooks/useTranslator';

const useStyles = makeStyles((theme) => ({
	menu: {
		marginTop: '60px',
	},
	input: {
		width: '200px',
	},
}));

export default function LanguageSelectButton() {
	const classes = useStyles();
	let selectedLanguage = localStorage.getItem('lang') || Language.EE;
	const options: Option[] = [
		{ value: Language.EE, label: 'Eesti keel' },
		{ value: Language.EN, label: 'English' },
	];
	return (
		<FormControl variant="outlined" className={classes.input}>
			<Select
				value={selectedLanguage}
				onChange={handleChange}
				style={{ textAlign: 'left' }}
				MenuProps={{ className: classes.menu }}
			>
				{options.map(({ value, label }) => (
					<MenuItem key={value} value={value}>
						{label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	function handleChange(e) {
		const lang = e.target.value;
		localStorage.setItem('lang', lang);
		window.location.reload();
	}
}
