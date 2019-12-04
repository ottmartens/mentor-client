import React from 'react';
import { Button, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { isSet, validateInputs } from '../../services/validators';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { HasUserProps } from '../../types';
import { BASE_URL } from '../../services/variables';
import Loader from '../../components/loader/Loader';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import { UserContext } from '../../contexts/UserContext';
import Notice from '../../components/notice/Notice';
import Image from '../../components/image/Image';
import classNames from 'classnames';
import SelectField from '../../components/selectField/SelectField';
import ConfirmationModal from '../../components/confirmationModal/ConfirmationModal';
import { removeUserToken } from '../../services/auth';
import { uploadImage, validateImage } from '../../services/uploadImage';

const useStyles = makeStyles((theme) => ({
	card: {
		textAlign: 'center',
		marginBottom: '8px',
		padding: '8px 0',
	},
	title: {
		color: '#2c4d7f',
		textAlign: 'center',
	},
	button: { 
		margin: '4px',
	},
	imageContainer: {
		display: 'block',
		marginLeft: 'auto',
		marginRight: 'auto',
		maxHeight: '336px',
		maxWidth: '336px',
	},
	largeWidth: {
		width: '320px',
	},
	imageButton: {
		position: 'relative',
		zIndex: 2,
		color: '#fff',
		background: '#3185FC',
		padding: '6px 16px',
		fontSize: '0.85rem',
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
		backgroundColor: 'transparent',
		margin: '1em auto',
		color: '#f00',
		boxShadow: 'none',
		'&:hover': {
			backgroundColor: 'transparent',
			boxShadow: 'none',
		},
		'&:focus': {
			backgroundColor: 'transparent',
			boxShadow: 'none',
		},
	},
	declineButtonContainer: {
		display: 'flex',
		alignItems: 'center',
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
		fontSize: '0.775rem',
	},
	infoLabel: {
		width: '30%',
		textAlign: 'right',
		fontSize: '0.875rem',
	},
	image: {
		margin: '8px',
	},
	select: {
		display: 'flex',
		margin: '16px auto 8px auto',
	},
}));

export default function ProfileView({ user }: HasUserProps) {
	const classes = useStyles();

	const userContext = React.useContext(UserContext);
	const setUser = userContext && userContext.setUser;

	const [isloadingImage, setIsLoadingImage] = React.useState(false);
	const [isEdited, setIsEdited] = React.useState(false);
	const [isEditable, setIsEditable] = React.useState(false);
	const [isOpen, setOpen] = React.useState(false);
	const [imageUploadError, setImageUploadError] = React.useState<string | undefined>();

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

	const [selfDeleteFn] = useBackend({
		requestMethod: RequestMethod.DELETE,
		endPoint: EndPoint.SELF_DELETE,
		endPointUrlParam: user.id,
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

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClickClose = () => {
		setOpen(false);
	};

	const handleSubmit = async () => {
		await selfDeleteFn();
		setOpen(false);
		removeUserToken();
		setUser && setUser(null);
	};

	return (
		<>
			<h1 className={classes.title}>{t(Translation.PROFILE)}</h1>
			<Card className={classes.card}>
				{error && <Notice variant="error" title="Profile updating failed" message={error} />}
				{imageUploadError && <Notice variant="error" title="Image upload failed" message={imageUploadError} />}
				{isEdited && <Notice variant="success" title="Profile updated successfully" />}
				<div>
					<div>
						<div className={classes.imageContainer}>
							<Image
								className={classes.image}
								src={userData.imageUrl ? `${BASE_URL}${userData.imageUrl}` : '/images/avatar_placeholder.webp'}
							/>
						</div>
						<label className={classes.imageButtonContainer}>
							<input
								accept="image/*;capture=camera"
								type="file"
								onChange={uploadImageOnChange}
								style={{ display: 'none' }}
							/>
							<span className={classes.imageButton}>
								{user.imageUrl? t(Translation.CHANGE_PICTURE) : t(Translation.ADD_PICTURE)} {isloadingImage && <Loader size="0.975rem" />}
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
								<SelectField
									labelWidth={42}
									options={[
										{ value: t(Translation.PROFILE_COMPUTER_SCIENCE), label: t(Translation.PROFILE_COMPUTER_SCIENCE) },
										{ value: t(Translation.PROFILE_MATHEMATICS), label: t(Translation.PROFILE_MATHEMATICS) },
										{ value: t(Translation.PROFILE_STATISTICS), label: t(Translation.PROFILE_STATISTICS) },
										{ value: t(Translation.OTHER), label: t(Translation.OTHER) },
									]}
									className={classNames(classes.largeWidth, classes.select)}
									{...input.degree}
									label={t(Translation.DEGREE)}
								/>
								<SelectField
									labelWidth={80}
									options={[
										{ value: `${t(Translation.PROFILE_BACHELOR)} 1.`, label: `${t(Translation.PROFILE_BACHELOR)} 1.` },
										{ value: `${t(Translation.PROFILE_BACHELOR)} 2.`, label: `${t(Translation.PROFILE_BACHELOR)} 2.` },
										{ value: `${t(Translation.PROFILE_BACHELOR)} 3.`, label: `${t(Translation.PROFILE_BACHELOR)} 3.` },
										{ value: `${t(Translation.PROFILE_MASTERS)} 4.`, label: `${t(Translation.PROFILE_MASTERS)} 1.` },
										{ value: `${t(Translation.PROFILE_MASTERS)} 5.`, label: `${t(Translation.PROFILE_MASTERS)} 2.` },
										{ value: t(Translation.OTHER), label: t(Translation.OTHER) },
									]}
									className={classNames(classes.largeWidth, classes.select)}
									{...input.year}
									label={t(Translation.YEAR)}
								/>
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
										<td className={classes.infoLabel}>{t(Translation.NAME)}</td>
										<td className={classes.info}>{userData.name}</td>
									</tr>
									<tr>
										<td className={classes.infoLabel}>{t(Translation.DEGREE)}</td>
										<td className={classes.info}>{userData.degree}</td>
									</tr>
									<tr>
										<td className={classes.infoLabel}>{t(Translation.YEAR)}</td>
										<td className={classes.info}>{userData.year}</td>
									</tr>
									<tr>
										<td className={classes.infoLabel}>{t(Translation.PROFILE_CHARACTERIZATION)}</td>
										<td className={classes.info}>{userData.tagline}</td>
									</tr>
									<tr>
										<td className={classes.infoLabel}>{t(Translation.BIO)}</td>
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
								{isEditable ? t(Translation.CANCEL) : t(Translation.PROFILE_CHANGE)}
							</Button>
							{isEditable && (
								<div>
									<Button variant="contained" color="primary" type="submit" className={classes.button}>
									{t(Translation.SAVE)}
									</Button>
									<div className={classes.declineButtonContainer}>
										<Button
											variant="contained"
											size= "small"
											onClick={handleClickOpen}
											className={classNames(classes.button, classes.declineButton)}
										>
										KUSTUTA KASUTAJA
										</Button>
									</div>
									<ConfirmationModal
										title=""
										description="Kas oled kindel et soovid oma kasutaja kustutada?"
										isOpen={isOpen}
										onSubmit={handleSubmit}
										onClose={handleClickClose}
									></ConfirmationModal>
								</div>
							)}
						</div>
					</form>
				</div>
			</Card>
		</>
	);

	async function uploadImageOnChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files || !event.target.files[0]) {
			return;
		}
		const file = event.target.files[0];
		const validationError = validateImage(file, 10);
		setImageUploadError(validationError);
		if (validationError) {
			return;
		}
		setIsLoadingImage(true);
		const result = await uploadImage(file, '/api/user/image', user.token);
		setIsLoadingImage(false);
		await getUserInfo();
		const imageUrl = result && result.data && result.data.data && result.data.data.imageUrl;
		if (!imageUrl || !setUser) {
			return;
		}
		setUser({ ...user, imageUrl });
	}
}
