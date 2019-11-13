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
		color: '#fff',
		background: '#3185FC',
		padding: '6px 16px',
		fontSize: '0.975rem',
		minWidth: '64px',
		boxSizing: 'border-box',
		fontWeight: 500,
		lineHeight: '1.75',
		borderRadius: '4px',
		letterSpacing: '0.02857em',
		textTransform: 'uppercase',
		boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
	},
	imageButtonContainer: {
		display: 'block',
		marginTop: '-14px',
		marginBottom: '14px',
	},
	declineButton: {
		backgroundColor: '#B40404',
		marginBottom: '8px',
		color: '#fff',
	},
}));

export default function ProfileView({ user }: HasUserProps) {
	const classes = useStyles();
	const [isloadingImage, setIsLoadingImage] = React.useState(false);
	const [imagePreview, setImagePreview] = React.useState<string |undefined>()

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
		tagline: useInput({ validators: [isSet], initialValue: (userData && userData.tagline) || '' }),
		bio: useInput({ validators: [isSet], initialValue: (userData && userData.bio) || '' }),
	};

	const [updateProfile] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.UPDATE_PROFILE,
		variables: {
			firstName: input.firstName.value,
			lastName: input.lastName.value,
			tagline: input.tagline.value,
			bio: input.bio.value,
		},
		authToken: user.token,
	});

	if (loading || !userData) {
		return <Loader />;
	}

	return (
		<Container className={classes.container} maxWidth="sm">
			<h2>Profile</h2>

			<div>
				<div>
					<CardMedia
						image={imagePreview ? imagePreview : user.imageUrl ? `${BASE_URL}${user.imageUrl}` : '/images/avatar_placeholder.webp'}
						className={classes.image}
					/>
					<label className={classes.imageButtonContainer}>
						<input accept="image/*" type="file" onChange={onChangeHandler} style={{ display: 'none' }} />
						<span className={classes.imageButton}>Upload {isloadingImage && <Loader size="0.975rem" />}</span>
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
					<Field className={classes.largeWidth} {...input.tagline} label="Tagline" />
					<Field className={classes.largeWidth} {...input.bio} label="Bio" multiline />
					<Button variant="contained" color="primary" type="submit" className={classes.button}>
						SAVE
					</Button>
				</form>
			</div>

			<Button variant="contained" type="submit" className={classes.declineButton}>
				DELETE
			</Button>
		</Container>
	);

	function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files || !event.target.files[0]) {
			return;
		}
		const file = event.target.files[0]
		var formData = new FormData();
		formData.append('file', file);
		setIsLoadingImage(true);
		axios({
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
				setImagePreview(URL.createObjectURL(file))
			});
	}
}
