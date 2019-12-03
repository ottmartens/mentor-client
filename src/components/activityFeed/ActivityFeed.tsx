import React from 'react';
import { makeStyles, ListItem, ListItemText, Card, Divider, List} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CheckCircleOutline, ErrorOutline, HelpOutline} from '@material-ui/icons';
import classNames from 'classnames';

export interface Activity {
    ID: number;
    name: string;
    points: number;
    isVerified?: boolean;
    time: string;
}

interface Props {
	activities: Activity[];
	onlyVerified: boolean;
    pointsum: number;
	acttotal: number;
}


const useStyles = makeStyles((theme) => ({
	container: {
		marginBottom: '12px',
	},
	listLink: {
		display: 'flex',
		flexGrow: 1,
		textDecoration: 'none',
		color: 'initial',
	},
	listImage: {
		borderRadius: '50%',
    },
    suuredArvud: {
		color: 'purple',
		fontSize: '20px',
		marginRight: '15px',
	},
	punktid: {
		textAlign: 'right',
	},
	questionmark: {
		marginRight: '20px',
		fontSize: '32px',
		color: '#f0c605',
	},
	exclamationmark: {
		color: 'red',
		marginRight: '20px',
		fontSize: '32px',
	},
	checkmark: {
		color: 'green',
		marginRight: '20px',
		fontSize: '32px',
    },
    card: {
		padding: '20px',
		marginBottom: '12px',
	},
	alignCenter: {
        textAlign: 'center',
    }
}
    ));

export default function ActivityFeed({activities, onlyVerified, pointsum, acttotal}: Props){
    const classes = useStyles();

    return(
    <Card className={classNames(classes.card, classes.alignCenter)}>
				<h4>
					Grupi tegevusi kokku: <span className={classes.suuredArvud}>{acttotal} </span> Grupi teenitud punktid: <span className={classes.suuredArvud}>{pointsum}</span>
				</h4>
				<Divider />
				<List>
					{activities.map(({ID, name, points, isVerified, time}) => {
						return (
						<div key={ID}>
                            {(!onlyVerified || onlyVerified && isVerified) && (
							<ListItem>
								{isVerified === null && (
									<HelpOutline className={classes.questionmark}>
									</HelpOutline>
								)}
								{isVerified === true && (
									<CheckCircleOutline className={classes.checkmark}>
									</CheckCircleOutline>
								)}
								{isVerified === false && (
									<ErrorOutline className={classes.exclamationmark}>
									</ErrorOutline>
								)}
								<Link to={`/member/activity/${ID}`} className={classes.listLink}>
									<ListItemText primary={name} secondary={time} />
									<p className={classes.punktid}>
										<span className={classes.suuredArvud}>{points} p</span>
									</p>
								</Link>
                            </ListItem>
                            )}
						</div>
					)})}
				</List>
			</Card>
    )
}