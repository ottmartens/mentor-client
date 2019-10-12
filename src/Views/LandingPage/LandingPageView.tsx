import React from "react";
import { Button, Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	logo: { flexGrow: 1 },
	buttons: {
		flexGrow: 1,
		textAlign: "center"
	},
	button: {
		minWidth: "128px",
		margin: "4px"
	},
	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		flexGrow: 1
	}
}));

export default function LandingPageView() {
	const classes = useStyles();
	return (
		<Container className={classes.container} component="main" maxWidth="sm">
			<div className={classes.logo}>MITS LOGO</div>
			<div className={classes.buttons}>
				<div>
					<Button
						className={classes.button}
						variant="contained"
						color="primary"
					>
						LOG IN
					</Button>
				</div>
				<div>
					<Button
						className={classes.button}
						variant="contained"
						color="primary"
					>
						REGISTER
					</Button>
				</div>
			</div>
		</Container>
	);
}
