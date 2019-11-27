import React from 'react';
import { Container, List, ListItem, Divider, Link, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { UserContext } from '../../contexts/UserContext';

const useStyles = makeStyles((theme) => ({
	container: {
		flexGrow: 1,
		textAlign: 'center',
		marginBottom: '16px',
	},
	listitem: {
		textAlign: 'center',
		justifyContent: 'center',
	},
	link: {
		textDecoration: 'none',
		color: 'inherit',
	},
	title: {
		color: '#2c4d7f',
		textAlign: 'center',
	},
}));

export default function CompletedActivitiesView({ user }: HasUserProps) {
	const classes = useStyles();
	const userContext = React.useContext(UserContext);
	const [added, isAdded] = React.useState(false);
	const t = useTranslator();
	const [queryCompletedActivities, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.COMPLETED_ACTIVITIES,
		authToken: user.token,
		skip: true,
	});

	/* React.useEffect(() => {
		if (called) {
			return;
		}
		queryCompletedActivities();
	}, [called, queryCompletedActivities]);

    if (loading || !data) {
		return <Loader />;
    } */

	const mock = [
		{ name: 'Jäätise söömine', group: 'Ants, Peeter ja sõbrad', id: '1' },
		{ name: 'Õues jalkat', group: 'Ants, Peeter ja sõbrad', id: '1' },
		{ name: 'Kasta lilli', group: 'Kängurud', id: '1' },
	];

	return (
		<>
			<h1 className={classes.title}>{t(Translation.GRADE_ACTIVITIES)}</h1>
			<Card className={classes.container}>
				<List>
					{mock.map(({ name, group, id }) => {
						return (
							<div>
								<Divider component="li" />
								<ListItem className={classes.listitem}>
									<div>
										<Link href={id ? `/activities/activity/${id}` : '#'} className={classes.link}>
											<h2>{name}</h2>
										</Link>
										<h4>{group}</h4>
									</div>
								</ListItem>
							</div>
						);
					})}
				</List>
			</Card>
		</>
	);
}
