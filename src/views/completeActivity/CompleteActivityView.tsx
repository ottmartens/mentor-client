import React from 'react';
import { Card, Input, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { HasUserProps } from '../../types';
import useInput from '../../hooks/useInput';
import Field from '../../components/field/Field';
import useTranslator from '../../hooks/useTranslator';
import { Translation } from '../../translations';
import DatepickerField from '../../components/datepickerField/DatepickerField';
import SelectField from '../../components/selectField/SelectField';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import Loader from '../../components/loader/Loader';
import { FieldError } from '../../services/validators';

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
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const names = [
	'Oliver Hansen',
	'Van Henry',
	'April Tucker',
	'Ralph Hubbard',
	'Omar Alexander',
	'Carlos Abbott',
	'Miriam Wagner',
	'Bradley Wilkerson',
	'Virginia Andrews',
	'Kelly Snyder',
];

export default function CompleteActivityView({ match: { params }, user }: Props) {
	const classes = useStyles();
	const [participants, setParticipants] = React.useState<string[] | undefined>([] as string[]);

	const handleChangeMultiple = (event) => {
		const { options } = event.target;
		const value: any = [];
		for (let i = 0, l = options.length; i < l; i += 1) {
			if (options[i].selected) {
				value.push(options[i].value);
			}
		}
		setParticipants(value);
	};

	const t = useTranslator();

	const input = {
		name: useInput(),
		description: useInput(),
		time: useInput(),
	};

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

	if (!data || loading) {
		return <Loader />;
	}

	const mentees = data && data.mentees;

	return (
		<>
			<h1 className={classes.title}>Complete activity</h1>
			<Card>
				<Field {...input.name} label={t(Translation.NAME)} />
				<Field {...input.description} label={t(Translation.GROUP_DESCRIPTION)} />
				<DatepickerField {...input.time} label={t(Translation.COMPLETE_ACTIVITY_TIME)} />
				<Select
					multiple
					value={participants}
					onChange={handleChangeMultiple}
					input={<Input />}
					renderValue={(selected: any) => selected.join(', ')}
					MenuProps={MenuProps}
				>
					{names.map((name) => (
						<MenuItem key={name} value={name}>
							{name}
						</MenuItem>
					))}
				</Select>
				<input type="file" accept="image/*;capture=camera" style={{ display: 'none' }} />
			</Card>
		</>
	);
}
