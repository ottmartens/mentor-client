import React from 'react';
import { HasUserProps } from '../../types';
import { Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import useInput, { UseInput } from '../../hooks/useInput';
import Field from '../../components/field/Field';
import { validateInputs, isSet, isEmail } from '../../services/validators';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';


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
    form: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		flexGrow: 1,
		textAlign: 'center',
	},
}));

export default function MentorGroupEditView({ user }: HasUserProps) {
	const classes = useStyles();
	const input: { [s: string]: UseInput } = {
		groupName: useInput({ validators: [isSet] }),
		tagline: useInput({ validators: [isSet] }),
		description: useInput(),
    };
    const [requestFn, { data, error }] = useBackend({
		requestMethod: RequestMethod.POST,
		endPoint: EndPoint.GROUP_EDIT,
		variables: {
			groupName: input.groupName.value,
			tagline: input.tagline.value,
			description: input.description.value,
		},
    });

	return (
		<Container className={classes.container} maxWidth="sm">
			<h2>Mentorgroup editing</h2>

			<div>
				<form
                    onSubmit={(e) => {
					    e.preventDefault();
					    if (validateInputs(input)) {
						    requestFn();
					    }
                    }}
                    className={classes.form}
                >
					<Field className={classes.largeWidth} {...input.groupName} label="Group Name" />
					<Field className={classes.largeWidth} {...input.tagline} label="Tagline(Short description)" />
					<Field className={classes.largeWidth} {...input.description} label="Group description" multiline />
					<Button variant="contained" color="primary" type="submit" className={classes.button}>
						SAVE CHANGES
					</Button>
				</form>
			</div>
		</Container>
	);
}