import React from "react";

export default function useInput(initialValue?: any) {
	const [value, setValue] = React.useState(
		initialValue ? initialValue : undefined
	);

	return { value, setValue };
}
