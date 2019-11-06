import React from 'react';
import { Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { CardMedia } from '@material-ui/core';
import { isSet, validateInputs } from '../../services/validators';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';

const useStyles = makeStyles((theme) => ({
	container: {
		flexGrow: 1,
		textAlign: 'center',
		marginBottom: '16px',
	},

	input: {},
	button: { marginBottom: '8px' },
	image: {
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
		height: '224px',
		width: '224px',
	},
	largeWidth: {
		width: '224px',
	},
	imageButton: {
		marginTop: '-28px',
	},
}));

export default function ProfileView({ user }: HasUserProps) {
	console.log(user);

	return <div>hello</div>;
	/* const classes = useStyles();
	const [image, selectImage] = React.useState<File | undefined>();

	const [getUserInfo, { data: userData, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.USER,
	});

	const input: { [s: string]: UseInput } = {
		firstName: useInput({ validators: [isSet], initialValue: `${user.firstName}` }),
		lastName: useInput({ validators: [isSet], initialValue: `${user.lastName}` }),
		bio: useInput({ validators: [isSet], initialValue: `${user.bio}` }),
	};

	const [updateProfile, { data }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.UPDATE_PROFILE,
		variables: {
			firstName: input.firstName.value,
			lastName: input.lastName.value,
			bio: input.bio.value,
		},
		authToken: user.token,
	});

	return (
		<Container className={classes.container} maxWidth="sm">
			<h2>Profile</h2>

			<div>
				<div>
					<CardMedia
						image={user.imageUrl ? user.imageUrl : '/images/avatar_placeholder.webp'}
						className={classes.image}
					/>
					<input
						accept="image/*"
						className={classes.input}
						style={{ display: 'none' }}
						id="raised-button-file"
						type="file"
						onChange={onChangeHandler}
					/>
					<label htmlFor="raised-button-file">
						<Button variant="contained" color="secondary" className={classes.imageButton}>
							Upload
						</Button>
					</label>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (validateInputs(input)) {
							updateProfile();
						}
					}}
				>
					<Field className={classes.largeWidth} {...input.firstName} label="First name" />
					<Field className={classes.largeWidth} {...input.lastName} label="Last name" />
					<Field className={classes.largeWidth} {...input.bio} label="Bio" multiline />
					<Button variant="contained" color="primary" type="submit" className={classes.button}>
						SAVE
					</Button>
				</form>
			</div>
		</Container>
	);

	function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) {
			return;
		}
		console.log('changed state');
		selectImage(event.target.files[0]);
	} */
}
