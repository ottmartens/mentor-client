import React from 'react';
import { HasUserProps } from '../../types';
import { Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { CardMedia } from '@material-ui/core';
import { isSet } from '../../services/validators';

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
	const [image, selectImage] = React.useState<File | undefined>();
	const input: { [s: string]: UseInput } = {
		firstName: useInput({ validators: [isSet] }),
		lastName: useInput({ validators: [isSet] }),
		bio: useInput(),
	};
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

				<form>
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
	}
}
