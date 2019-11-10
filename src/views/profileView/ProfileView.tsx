import React from 'react';
import { Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { CardMedia } from '@material-ui/core';
import { isSet, validateInputs } from '../../services/validators';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';
import axios from 'axios';
import { BASE_URL, queryPrefix } from '../../services/variables';
import Loader from '../../components/loader/Loader';

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
	const classes = useStyles();
	const [isloadingImage, setIsLoadingImage] = React.useState(false);

	const [getUserInfo, { data: userData, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.USER,
		authToken: user.token,
	});

	React.useEffect(() => {
		if (called) {
			return;
		}
		getUserInfo();
	}, [called, getUserInfo]);

	const input: { [s: string]: UseInput } = {
		firstName: useInput({ validators: [isSet], initialValue: (userData && userData.firstName) || '' }),
		lastName: useInput({ validators: [isSet], initialValue: (userData && userData.lastName) || '' }),
		bio: useInput({ validators: [isSet], initialValue: (userData && userData.bio) || '' }),
	};

	const [updateProfile] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.UPDATE_PROFILE,
		variables: {
			firstName: input.firstName.value,
			lastName: input.lastName.value,
			bio: input.bio.value,
		},
		authToken: user.token,
	});

	if (loading || !userData) {
		return <div>Loading...</div>;
	}
	console.log(userData);

	return (
		<Container className={classes.container} maxWidth="sm">
			<h2>Profile</h2>

			<div>
				<div>
					<CardMedia
						image={user.imageUrl ? `${BASE_URL}${user.imageUrl}` : '/images/avatar_placeholder.webp'}
						className={classes.image}
					/>

					<input accept="image/*" className={classes.input} type="file" onChange={onChangeHandler} />
					{/* <Button variant="contained" color="secondary" className={classes.imageButton} disabled={isloadingImage}>
							Upload {isloadingImage && <Loader />}
						</Button> */}
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
		if (!event.target.files || !event.target.files[0]) {
			return;
		}
		var formData = new FormData();
		formData.append('file', event.target.files[0]);
		setIsLoadingImage(true);
		return axios({
			method: 'post',
			url: `${BASE_URL}${queryPrefix}/user/image`,
			data: formData,
			headers: { 'Content-Type': 'multipart/form-data', Authorization: user.token },
		})
			.catch((err) => {
				throw new Error(err);
			})
			.finally(() => {
				setIsLoadingImage(false);
			});
	}
}
