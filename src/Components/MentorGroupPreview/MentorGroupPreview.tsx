import React from "react";
import {
	makeStyles,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Typography
} from "@material-ui/core";

export interface Mentor {
	ImageUrl: string;
}

interface Props {
	mentors: Mentor[];
	groupName: string;
	bio: string;
	id?: string;
	showNames?: boolean;
	showGroupName?: boolean;
}

const useStyles = makeStyles(theme => ({
	container: {
		marginBottom: "12px"
	},
	mentors: {
		display: "flex",
		justifyContent: "space-around"
	},

	image: { width: "100%", height: "150px" }
}));

export default function MentorGroupPreview({
	mentors,
	groupName,
	bio,
	id,
	showNames,
	showGroupName
}: Props) {
	const classes = useStyles();

	if (true) {
		return (
			<Card className={classes.container}>
				<CardActionArea href={id ? `/mentor-group/${id}` : "#"}>
					<div className={classes.mentors}>
						{mentors.map(({ ImageUrl }, idx) => {
							return (
								<CardMedia
									key={idx}
									className={classes.image}
									image={ImageUrl}
								/>
							);
						})}
					</div>

					<CardContent>
						{showGroupName && (
							<Typography
								gutterBottom
								variant="h5"
								component="h2"
							>
								{groupName}
							</Typography>
						)}
						<Typography
							variant="body2"
							color="textSecondary"
							component="p"
						>
							{bio}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		);
	}
}
