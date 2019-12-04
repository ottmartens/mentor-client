import React from 'react';
import { Card, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { HasUserProps } from '../../types';
import useInput from '../../hooks/useInput';
import Field from '../../components/field/Field';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import DatepickerField from '../../components/datepickerField/DatepickerField';
import SelectField, { Option } from '../../components/selectField/SelectField';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import Loader from '../../components/loader/Loader';
import classNames from 'classnames';
import { validateImage, uploadImage } from '../../services/uploadImage';
import { BASE_URL } from '../../services/variables';
import Image from '../../components/image/Image';
import { isSet, validateInputs, FieldError } from '../../services/validators';

interface Props extends HasUserProps {
	match: {
		params: {
			id: string;
		};
	};
}

const useStyles = makeStyles((theme) => ({
	title: {
		textAlign: 'center',
		color: '#2c4d7f',
	},
	inputField: {
		width: '320px',
	},
	inputContainer: {
		padding: '20px',
		display: 'flex',
		flexDirection: 'column',
	},
	marginMiddle: {
		margin: '16px auto 8px auto',
	},
	imageButtonContainer: {
		display: 'block',
		textAlign: 'center',
	},
	imageButton: {
		display: 'inline-block',
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
	imageContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
	image: {
		width: '100%',
	},
	buttonContainer: {
		textAlign: 'right',
	},
}));

export default function CompleteActivityView({ match: { params }, user }: Props) {
	const classes = useStyles();
	const [participants, setParticipants] = React.useState<string[]>([] as string[]);
	const [uploadedImages, setUploadedImages] = React.useState<string[]>([] as string[]);
	const [imageUploadError, setImageUploadError] = React.useState<string | undefined>();
	const [participantsError, setParticipantsError] = React.useState<FieldError | undefined>();
	const t = useTranslator();

	// get info about mentors and mentees
	const [getGroupInfo, { data, loading, called }] = useBackend({
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

	// getting details about selected activity
	const [getActivities, { data: activityData, called: activityCalled }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.GET_ACTIVITIES,
		authToken: user.token,
	});

	React.useEffect(() => {
		if (activityCalled) {
			return;
		}
		getActivities();
	}, [activityCalled, getActivities]);

	const selectedActivity = activityData && activityData.find((activity) => activity.id === params.id);

	// completing the activity
	const input = {
		name: useInput({ validators: [isSet], initialValue: selectedActivity && selectedActivity.name }),
		description: useInput({ validators: [isSet] }),
		time: useInput({ validators: [isSet] }),
	};

	const [completeActivity, { data: completeData, loading: completeLoading, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.ACTIVITIES,
		variables: {
			name: input.name.value,
			description: input.description.value,
			time: input.time.value,
			images: uploadedImages,
			participants,
		},
		authToken: user.token,
	});

	if (!data || loading) {
		return <Loader />;
	}

	const mentees: Option[] =
		data && data.mentees ? data.mentees.map((mentee) => ({ value: mentee.userId, label: mentee.name })) : [];
	const mentors: Option[] =
		data && data.mentors ? data.mentors.map((mentor) => ({ value: mentor.userId, label: mentor.name })) : [];

	return (
		<>
			<h1 className={classes.title}>Complete activity</h1>
			<Card>
				<form
					className={classes.inputContainer}
					onSubmit={(e) => {
						e.preventDefault();
						if (!validateInputs(input)) {
							return;
						}
						if (participants.length < selectedActivity.requiredParticipants || 3) {
							setParticipantsError(FieldError.NOT_SET);
							return;
						}
						if (uploadedImages.length < 1) {
							setImageUploadError('At least one image is required');
							return;
						}
						completeActivity();
					}}
				>
					<Field
						className={classNames(classes.inputField, classes.marginMiddle)}
						{...input.name}
						label={t(Translation.NAME)}
					/>
					<Field
						className={classNames(classes.inputField, classes.marginMiddle)}
						{...input.description}
						label={t(Translation.DESCRIPTION)}
					/>
					<DatepickerField
						className={classNames(classes.inputField, classes.marginMiddle)}
						{...input.time}
						label={t(Translation.COMPLETE_ACTIVITY_TIME)}
					/>
					<SelectField
						value={participants}
						setValue={setParticipants}
						className={classNames(classes.inputField, classes.marginMiddle)}
						labelWidth={64}
						error={participantsError}
						multiple
						label={t(Translation.PARTICIPANTS)}
						options={[...mentors, ...mentees]}
					/>
					<label className={classes.imageButtonContainer}>
						<input
							type="file"
							accept="image/*;capture=camera"
							onChange={uploadImageOnChange}
							style={{ display: 'none' }}
						/>
						<span className={classes.imageButton}>{t(Translation.ADD_PICTURE)}</span>
					</label>
					<div className={classes.imageContainer}>
						{uploadedImages.length > 0 &&
							uploadedImages.map((url, idx) => <img key={idx} src={`${BASE_URL}${url}`} className={classes.image} />)}
					</div>
					<div className={classes.buttonContainer}>
						<Button variant="contained" color="primary" type="submit">
							{t(Translation.SAVE)}
						</Button>
					</div>
				</form>
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
		const result = await uploadImage(file, '/api/activity/image', user.token);
		const imageUrl = result && result.data && result.data.data && result.data.data.imageUrl;
		if (!imageUrl) {
			setImageUploadError('Could not upload image. Please try again later');
			return;
		}
		setUploadedImages((prev) => [...prev, imageUrl]);
	}
}
