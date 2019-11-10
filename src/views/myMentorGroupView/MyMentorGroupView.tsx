import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';
import useInput from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { isSet } from '../../services/validators';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		textAlign: 'center',
	},
}));

export default function MyMentorGroupView({ user }: HasUserProps) {
	const classes = useStyles();
	const [isEditable, setIsEditable] = React.useState(false);
	const [getGroupInfo, { data, loading, error, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.MY_GROUP,
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		getGroupInfo();
	}, [called, getGroupInfo]);
	const input = {
		title: useInput({ validators: [isSet], initialValue: (data && data.title) || '' }),
		desc: useInput({ validators: [isSet], initialValue: (data && data.desc) || '' }),
		bio: useInput({ validators: [isSet], initialValue: (data && data.bio) || '' }),
	};
	return (
		<div className={classes.wrapper}>
			<h2>My mentorgroup view</h2>
			<Field {...input.title} label="title" disabled={!isEditable} />
			<Field {...input.desc} label="description" disabled={!isEditable} multiline />
			<Field {...input.bio} label="bio" disabled={!isEditable} multiline />
		</div>
	);
}
