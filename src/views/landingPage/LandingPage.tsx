import React from "react";
import { Button, Container, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	logo: {
		display: "block",
		width: "170px",
		height: "170px",
		margin: "auto"
	},
	logoContainer: {
		display: "flex",
		width: "200px",
		height: "200px",
		background: "#3f51b5",
		margin: "auto",
		borderRadius: "50%"
	},
	buttons: {
		marginTop: "20px",
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
		justifyContent: "center",
		flexGrow: 1,
		padding: "30px"
	}
}));

export default function LandingPageView() {
	const classes = useStyles();

	return (
		<Container className={classes.container} component="main" maxWidth="sm">
			<div className={classes.logoContainer}>
				<img
					className={classes.logo}
					src="images/logo_valge.webp"
					alt="MITS LOGO"
				></img>
			</div>
			<div className={classes.buttons}>
				<div>
					<Button
						href="/login"
						className={classes.button}
						variant="contained"
						color="primary"
					>
						LOG IN
					</Button>
				</div>
				<div>
					<Button
						href="/register"
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
