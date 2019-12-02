import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

interface Props {
    value: boolean;
    label: string;
    setValue: (value: string) => void;
}

/*
const useStyles = makeStyles((theme) => ({
	error: {
		display: 'block',
		color: '#f00',
	},
}));
*/

export default function Field({ value, label, setValue }: Props) {
	//const classes = useStyles();
	return (
		<>
            <FormControlLabel 
                value={value || ''} 
                control={<Checkbox onChange={handleChange} />}
                label={label}
            />
		</>
	);

	function handleChange(event) {
		setValue(event.target.value);
	}
}
