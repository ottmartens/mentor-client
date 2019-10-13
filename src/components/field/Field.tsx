import React from "react";
import { TextField } from "@material-ui/core";

interface Props {
	type?: "text" | "password";
	label: string;
	setValue: (value: string) => void;
	value: string;
}

export default function Field({ label, type, setValue, value }: Props) {
	return (
		<TextField
			id={type === "text" ? "outlined-name" : "outlined-password-input"}
			label={label}
			type={type}
			onChange={handleChange}
			margin="normal"
			variant="outlined"
		/>
	);

	function handleChange(event) {
		setValue(event.target.value);
	}
}
