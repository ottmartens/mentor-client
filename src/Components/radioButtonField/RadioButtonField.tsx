import React from "react";
import {
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio
} from "@material-ui/core";

interface Option {
	value: string;
	label: string;
}

interface Props {
	formLabel?: string;
	value: string;
	setValue: (newValue: string) => void;
	options: Option[];
}

export default function RadioButtonField({
	formLabel,
	value,
	options,
	setValue
}: Props) {
	const handleChange = event => {
		setValue(event.target.value);
	};
	return (
		<FormControl component="fieldset">
			<FormLabel component="legend">{formLabel}</FormLabel>
			<RadioGroup value={value} onChange={handleChange}>
				{options.map((opt, idx) => {
					return (
						<FormControlLabel
							key={idx}
							value={opt.value}
							control={<Radio />}
							label={opt.label}
						/>
					);
				})}
			</RadioGroup>
		</FormControl>
	);
}
