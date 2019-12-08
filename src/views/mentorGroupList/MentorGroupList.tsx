import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import MentorGroupPreview from '../../components/mentorGroupPreview/MentorGroupPreview';
import { makeStyles } from '@material-ui/styles';
import { HasUserProps } from '../../types';
import Loader from '../../components/loader/Loader';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	alignCenter: {
		textAlign: 'center',
	},
	title: {
		color: '#2c4d7f',
	},
	link: {
		textDecoration: 'none',
		color: 'inherit',
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
			<h1 className={classes.title}>{t(Translation.MENTORGROUPS)}</h1>
			<div>
				{data &&
					data.map(({ mentors, title, id, description }, idx) => {
						return (
							<Link
								to={
									user.groupId && id && user.groupId.toString() == id
										? '/member/my-mentor-group/'
										: id
										? `/member/mentor-group/${id}`
										: '#'
								}
								className={classes.link}
							>
								<MentorGroupPreview
									id={id}
									key={idx}
									mentors={mentors}
									groupName={title}
									bio={description}
									showGroupName={true}
									showNames={true}
									showLongBio={false}
								/>
							</Link>
						);
					})}
			</div>
		</div>
	);
}
