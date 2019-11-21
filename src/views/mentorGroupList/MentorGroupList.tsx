import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Container } from '@material-ui/core';
import MentorGroupPreview from '../../components/mentorGroupPreview/MentorGroupPreview';
import { makeStyles } from '@material-ui/styles';
import { HasUserProps } from '../../types';
import Loader from '../../components/loader/Loader';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';

const useStyles = makeStyles((theme) => ({
	alignCenter: {
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
	const t = useTranslator();

	React.useEffect(() => {
		if (called) {
			return;
		}
		queryFn();
	}, [called, queryFn]);

	if (loading || !data) {
		return <Loader />;
	}
	return (
		<div className={classes.alignCenter}>
			<h1>{t(Translation.MENTORGROUPS)}</h1>
			<div>
				{data &&
					data.map(({ mentors, title, id, description }, idx) => {
						return (
							<MentorGroupPreview
								id={id}
								key={idx}
								mentors={mentors}
								groupName={title}
								bio={description}
								showGroupName={true}
								showNames={false}
								showLongBio={false}
							/>
						);
					})}
			</div>
		</div>
	);
}
