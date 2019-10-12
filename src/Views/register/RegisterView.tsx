import React from "react";
import styles from "./registerView.module.scss";
import Button from "@material-ui/core/Button";
import { Container } from "@material-ui/core";

export default function RegisterView() {
	return (
		<Container>
			Register
			<Button variant="contained" color="primary">
				Hello World
			</Button>
		</Container>
	);
}
