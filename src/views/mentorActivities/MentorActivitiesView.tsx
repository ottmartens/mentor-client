import React from 'react';
import { HasUserProps, UserRole } from '../../types';
import { Button, Divider, Card, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import Loader from '../../components/loader/Loader';

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: 'none',
		color: 'inherit',
		textAlign: 'center',
	},
	title: {
		margin: '0',
	},

	description: {
		color: '#7b7b7b',
	},
	listElement: {
		margin: '12px 0 12px 0',
	},
	alignCenter: {
		textAlign: 'center',
	},
	container: {
		flexGrow: 1,
		textAlign: 'center',
        marginBottom: '16px',
	},
	title2: {
		color: '#2c4d7f'
	},
	makeButton: {
		marginBottom: '20px',
		marginLeft: '10px',
		backgroundColor: '#26c72b',
		color: '#fff',
	},
	instr: {
		display: 'inline-block',
	}
}));

export default function MentorActivitiesView({ user }: HasUserProps) {
	const classes = useStyles();
	const t = useTranslator();
	// get activities from database

	const [queryMockActivitiesData, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GET_MOCK_ACTIVITIES,
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryMockActivitiesData();
	}, [called, queryMockActivitiesData]);

	if (loading || !data) {
		return <Loader />;
    }

	return (
		<Container className={classes.container} maxWidth="sm">
			<h1 className={classes.title2}>
				{t(Translation.ACTIVITIES)}
			</h1>
			<Card>
				{user.role === UserRole.MENTOR && (
					<div>
						<h3 className={classes.instr}>{t(Translation.ACTIVITIES_INSTRUCTION)}</h3>
						<Link
							to='/member/add-activity/new'
							className={classes.link}>
							<Button
							variant="contained"
							className={classes.makeButton}
							>
								{t(Translation.MAKE_NEW_ONE)}
							</Button>
						</Link>
					</div>
				)}
				{data.map(({name, points, requiredParticipants, ID}) => (
					<div>
						<Divider />
						<Link to={`/member/add-activity/${ID}`} className={classes.link}>
							<div className={classes.listElement}>
								<h2 className={classes.title}>{name}</h2>
								<span
									className={classes.description}
								>{`${points} points | ${requiredParticipants}+ members`}</span>
							</div>
						</Link>
					</div>
				))}
			</Card>
		</Container>
	);
}