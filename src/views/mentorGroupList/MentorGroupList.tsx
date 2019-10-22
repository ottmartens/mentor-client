import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Container } from '@material-ui/core';
import MentorGroupPreview from '../../components/mentorGroupPreview/MentorGroupPreview';
import { makeStyles } from '@material-ui/styles';
import { HasUserProps } from '../../types';

const useStyles = makeStyles((theme) => ({
	container: {
		flexGrow: 1,
		textAlign: 'center',
	},
}));

export default function MentorGroupListView({ user }: HasUserProps) {
	const classes = useStyles();
	const [queryFn, { data, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GROUPS,
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryFn();
	}, [called, queryFn]);

	if (loading || !data) {
		return <div>Loading...</div>;
	}
	return (
		<Container className={classes.container} maxWidth="sm">
			<h1>Mentorgroups</h1>
			<div>
				{data &&
					data.map(({ mentors, title, tagline, id }, idx) => {
						return <MentorGroupPreview id={id} key={idx} mentors={mentors} groupName={title} bio={tagline} />;
					})}
			</div>
		</Container>
	);
}
