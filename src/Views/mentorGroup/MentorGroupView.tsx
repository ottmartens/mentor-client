import React from "react";
import { MentorGroupPreview } from "../../Components";
import useBackend, { RequestMethod, EndPoint } from "../../hooks/useBackend";
import {
	Container,
	Card,
	CardContent,
	CardMedia,
	Typography,
	CardActionArea,
	makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	container: {
		marginBottom: "12px"
	},
	mentors: {
		display: "flex",
		justifyContent: "space-around"
	},

	image: {
		display: "inline-block",
		width: "50px",
		height: "50px",
		borderRadius: "50%"
	},
	menteeRow: {
		display: "flex"
	},
	menteeName: {
		display: "inline-block",
		borderTop: "2px solid black",
		borderBottom: "2px solid black",
		margin: "0"
	}
}));

export default function MentorGroupView({ match }) {
	const classes = useStyles();
	const { params } = match;

	const menteed = [
		{
			FirstName: "Tere",
			LastName: "Terav",
			ImageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg"
		},
		{
			FirstName: "Tarmo",
			LastName: "Sulane",
			ImageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg"
		},
		{
			FirstName: "Jaan",
			LastName: "Tamm",
			ImageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg"
		}
	];

	const [queryFn, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GROUPS,
		endPointUrlParam: params.id
	});

	const groupInfo = data && data.data;

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryFn();
	});

	if (loading || !data) {
		return <div>Loading...</div>;
	}

	console.log(groupInfo);

	return (
		<Container>
			<div>
				<div>
					<MentorGroupPreview
						mentors={groupInfo.mentors}
						groupName={groupInfo.title}
						bio={groupInfo.description}
					/>
				</div>
				<div className={classes.container}>
					<Card>
						<CardActionArea>
							{menteed.map(
								({ ImageUrl, FirstName, LastName }, idx) => {
									return (
										<div
											key={idx}
											className={classes.menteeRow}
										>
											<CardMedia
												image={ImageUrl}
												className={classes.image}
											/>
											<CardContent
												className={classes.menteeName}
											>
												<Typography
													gutterBottom
													variant="h5"
													component="h2"
												>
													{`${FirstName} ${LastName}`}
												</Typography>
											</CardContent>
										</div>
									);
								}
							)}
						</CardActionArea>
					</Card>
				</div>
			</div>
		</Container>
	);
}
