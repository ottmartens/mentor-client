import React from 'react';
import { Container, Button, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { isSet, validateInputs } from '../../services/validators';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';
import axios from 'axios';
import { BASE_URL, queryPrefix } from '../../services/variables';
import Loader from '../../components/loader/Loader';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { UserContext } from '../../contexts/UserContext';
import Notice from '../../components/notice/Notice';
import Image from '../../components/image/Image';

const useStyles = makeStyles((theme) => ({
	card: {
		textAlign: 'center',
		marginBottom: '8px',
	},
	title: {
		color: '#2c4d7f',
		textAlign: 'center',
	},
	button: { marginBottom: '8px' },
	imageContainer: {
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
		maxHeight: '336px',
		maxWidth: '336px',
	},
	largeWidth: {
		width: '224px',
	},
	imageButton: {
		position: 'relative',
		zIndex: 2,
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
		marginTop: '-22px',
		marginBottom: '12px',
	},
	declineButton: {
		backgroundColor: '#B40404',
		marginBottom: '8px',
		color: '#fff',
	},
	table: {
		width: '336px',
		marginRight: 'auto',
		marginLeft: 'auto',
		marginBottom: '20px',
		marginTop: '12px',
		lineHeight: 1.43,
		letterSpacing: '0.01071em',
	},
	info: {
		display: 'block',
		textAlign: 'left',
		fontWeight: 400,
		marginLeft: '12px',
		marginTop: '4px',
		color: '#616060',
		fontSize: '0.975rem',
	},
	infoLabel: {
		textAlign: 'right',
		fontWeight: 700,
		fontSize: '1.175rem',
	},
	image: {
		margin: '8px',
	},
}));

export default function ProfileView({ user }: HasUserProps) {
	const classes = useStyles();
	const userContext = React.useContext(UserContext);
	const setUser = userContext && userContext.setUser;
	const [isloadingImage, setIsLoadingImage] = React.useState(false);
	const [isEdited, setIsEdited] = React.useState(false);
	const [isEditable, setIsEditable] = React.useState(false);

	const [imagePreview, setImagePreview] = React.useState<string | undefined>();

	const [getUserInfo, { data: userData, loading, called }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.USER,
		authToken: user.token,
	});
	const t = useTranslator();

	React.useEffect(() => {
		if (called) {
			return;
		}
		getUserInfo();
	}, [called, getUserInfo]);

	const input: { [s: string]: UseInput } = {
		name: useInput({ validators: [isSet], initialValue: (userData && userData.name) || '' }),
		degree: useInput({ validators: [isSet], initialValue: (userData && userData.degree) || '' }),
		year: useInput({ validators: [isSet], initialValue: (userData && userData.year) || '' }),
		tagline: useInput({ initialValue: (userData && userData.tagline) || '' }),
		bio: useInput({ initialValue: (userData && userData.bio) || '' }),
	};

	const [updateProfile, { data: updateProfileData, called: updateCalled, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.UPDATE_PROFILE,
		variables: {
			name: input.name.value,
			degree: input.degree.value,
			year: input.year.value,
			tagline: input.tagline.value,
			bio: input.bio.value,
		},
		authToken: user.token,
	});

	React.useEffect(() => {
		if (!updateCalled || !setUser) {
			return;
		}
		setUser({ ...user, ...updateProfileData });
		setIsEdited(true);
	}, [updateProfileData, setUser]);

	if (loading || !userData) {
		return <Loader />;
	}

	return (
		<>
			<h1 className={classes.title}>{t(Translation.PROFILE)}</h1>
			<Card className={classes.card}>
				{error && <Notice variant="error" title="Profile updating failed" message={error} />}
				{isEdited && <Notice variant="success" title="Profile updated successfully" message={error} />}
				<div>
					<div>
						<div className={classes.imageContainer}>
							<Image
								className={classes.image}
								src={
									imagePreview
										? imagePreview
										: user.imageUrl
										? `${BASE_URL}${user.imageUrl}`
										: '/images/avatar_placeholder.webp'
								}
							/>
						</div>
						<label className={classes.imageButtonContainer}>
							<input accept="image/*" type="file" onChange={onChangeHandler} style={{ display: 'none' }} />
							<span className={classes.imageButton}>
								{t(Translation.UPLOAD)} {isloadingImage && <Loader size="0.975rem" />}
							</span>
						</label>
					</div>

					<form
						onSubmit={async (e) => {
							e.preventDefault();
							if (validateInputs(input)) {
								await updateProfile();
								await getUserInfo();
								setIsEditable(false);
								setIsEdited(false);
							}
						}}
					>
						{isEditable ? (
							<>
								<Field className={classes.largeWidth} {...input.name} label={t(Translation.NAME)} />
								<Field className={classes.largeWidth} {...input.degree} label={t(Translation.DEGREE)} />
								<Field className={classes.largeWidth} {...input.year} label={t(Translation.YEAR)} />
								<Field className={classes.largeWidth} {...input.tagline} label={t(Translation.TAGLINE)} />
								<Field
									className={classes.largeWidth}
									{...input.bio}
									label={t(Translation.USER_DESCRIPTION)}
									multiline
								/>
							</>
						) : (
							<table className={classes.table}>
								<tbody>
									<tr>
										<td className={classes.infoLabel}>name:</td>
										<td className={classes.info}>{userData.name}</td>
									</tr>
									<tr>
										<td className={classes.infoLabel}>degree:</td>
										<td className={classes.info}>{userData.degree}</td>
									</tr>
									<tr>
										<td className={classes.infoLabel}>year:</td>
										<td className={classes.info}>{userData.year}</td>
									</tr>
									<tr>
										<td className={classes.infoLabel}>tagline:</td>
										<td className={classes.info}>{userData.tagline}</td>
									</tr>
									<tr>
										<td className={classes.infoLabel}>bio:</td>
										<td className={classes.info}>{userData.bio}</td>
									</tr>
								</tbody>
							</table>
						)}
						<div>
							<Button
								variant="contained"
								color="secondary"
								type="button"
								className={classes.button}
								onClick={() => {
									setIsEditable(!isEditable);
								}}
							>
								{t(Translation.EDIT_GROUP)}
							</Button>
							{isEditable && (
								<Button variant="contained" color="primary" type="submit" className={classes.button}>
									{t(Translation.SAVE_CHANGES)}
								</Button>
							)}
						</div>
					</form>
				</div>

				<Button variant="contained" type="submit" className={classes.declineButton}>
					KUSTUTA KASUTAJA
				</Button>
			</Card>
		</>
	);

	function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files || !event.target.files[0]) {
			return;
		}
		const file = event.target.files[0];
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
				setImagePreview(URL.createObjectURL(file));
			});
	}
	function ValidateSize(file) {
		var FileSize = file.files[0].size / 1024 / 1024; // in MB
		if (FileSize > 5) {
			alert('File size exceeds 5 MB');
			// $(file).val(''); //for clearing with Jquery
		}
	}
}
