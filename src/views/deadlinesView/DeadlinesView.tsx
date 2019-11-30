import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Card, makeStyles, CardContent, Button, Checkbox, FormControl, FormLabel, FormGroup, FormControlLabel, FormHelperText} from '@material-ui/core';
import { HasUserProps } from '../../types';
import useTranslator from '../../hooks/useTranslator';
//import { error } from 'console';
import Notice from '../../components/notice/Notice';
import RadioButtonField from '../../components/radioButtonField/RadioButtonField';
import useInput, { UseInput } from '../../hooks/useInput';
import { Translation } from '../../translations';

const useStyles = makeStyles((theme) => ({
	card: {
		padding: '20px',
		marginBottom: '12px',
		marginTop: '20px',
	},
	buttons: {
		margin: '2em 0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	container: {
		textAlign: 'center',
	},
}));

interface Props extends HasUserProps {
	match: {
		params: {
			id: string;
		};
	};
	setValue: (newValue: string) => void;
}

export default function DeadlinesView({ user }: Props) {
	const classes = useStyles();
	const t = useTranslator();
    const [changed, isChanging] = React.useState(false);

	const [state, setState] = React.useState({
		mentor: false,
		mentee: false,
	  });

	const { mentor, mentee } = state;


    const [queryDeadlineData, { data: currentDeadlineData, loading, called: currentDeadlineCalled }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.DEADLINE,
		authToken: user.token,
	});

	
    React.useEffect(() => {
		if (currentDeadlineCalled) {
			return;
		}
		queryDeadlineData();
    }, [currentDeadlineCalled, queryDeadlineData]);
	
    const input: { [s: string]: UseInput } = {
		mentor: useInput({ initialValue: (currentDeadlineData && currentDeadlineData.mentor) || '' }),
		mentee: useInput({ initialValue: (currentDeadlineData && currentDeadlineData.mentee) || '' }),
    };
    
	const [changeDeadlinesFn, { data , called, error }] = useBackend({
		requestMethod: RequestMethod.POST,
        endPoint: EndPoint.CHANGE_DEADLINES_REQUEST,
        variables: {
			mentor: input.mentor.value,
			mentee: input.mentee.value
		},
		authToken: user.token,
	});
    
	React.useEffect(() => {
		if (!changeDeadlinesFn || !called) {
			return;
        }
        changeDeadlinesFn();
		isChanging(true);
	}, [called, changeDeadlinesFn]);

	const handleChange = name => event => {
		setState({ ...state, [name]: event.target.checked });
		//changeDeadlinesFn();
	};

    /*if (loading || !currentDeadlineData) {
		return <Loader />;
    }*/
    
	return (
		<>
			{error && <Notice variant="error" title="Deadline change failed" message={error} />}
			{changed && <Notice variant="success" title="Deadlines changed successfully" message=''/>}
			<div className={classes.container}>
                <Card className={classes.card}>
                    <CardContent>
						<FormControl component="fieldset">
							<h1>{t(Translation.DEADLINES)}</h1>
							<FormGroup>
							<FormControlLabel
								control={<Checkbox checked={mentor} onChange={handleChange('mentor')} value={true}/>} //{currentDeadlineData.mentor} />}
								label="Registreerimine mentorite jaoks avatud"
							/>
							<FormControlLabel
control={<Checkbox checked={mentee} onChange={handleChange('mentee')} value={true}/>} //{currentDeadlineData.mentee} />}
								label="Registreerimine menteede jaoks avatud"
							/>
							</FormGroup>
						</FormControl>
                    </CardContent>
                </Card>
            </div>
		</>
	);
}
