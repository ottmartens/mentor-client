import React from 'react';
import useBackend, { RequestMethod, EndPoint } from '../../hooks/useBackend';
import { Card, makeStyles, Input, CardContent, Button, Typography} from '@material-ui/core';
import { HasUserProps, UserRole } from '../../types';
import useTranslator from '../../hooks/useTranslator';
import { error } from 'console';
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
}

export default function DeadlinesView({ user }: Props) {
	const classes = useStyles();
	const t = useTranslator();
    const [changed, isChanging] = React.useState(false);
    const radioButtonOptions = [{ value: 'MENTORS', label: 'Registration open for mentors' }, { value: 'MENTEES', label: 'Registration open for mentees' }, { value: 'CLOSED', label: 'Registration closed' }];

    const input: { [s: string]: UseInput } = {
		role: useInput({ initialValue: radioButtonOptions[0].value }),
    };
    
    const [queryDeadlineData, { data: currentDeadlineData, loading, called: currentDeadlineCalled }] = useBackend({
		requestMethod: RequestMethod.GET,
		endPoint: EndPoint.DEADLINE,
		authToken: user.token,
    });
    
	//accept or reject activity
	const [changeDeadlinesFn, { data , called, error }] = useBackend({
		requestMethod: RequestMethod.POST,
        endPoint: EndPoint.CHANGE_DEADLINES_REQUEST,
        variables: {
			role: input.role.value,
		},
		authToken: user.token,
	});

    React.useEffect(() => {
		if (currentDeadlineCalled) {
			return;
		}
		queryDeadlineData();
    }, [currentDeadlineCalled, queryDeadlineData]);
    
	React.useEffect(() => {
		if (!changeDeadlinesFn || !called) {
			return;
        }
        changeDeadlinesFn();
		isChanging(true);
	}, [called, changeDeadlinesFn]);

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
					<h1>{t(Translation.DEADLINES)}</h1>
                        <form>
                            <div className={classes.buttons}>
						        <RadioButtonField {...input.role} options={radioButtonOptions} />
					        </div>
                            <div>
							    <Button type="submit" variant="contained" color="primary">
								    {t(Translation.CHANGE)}
							    </Button>
						    </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
		</>
	);
}
