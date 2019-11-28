import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import './themes/main.scss';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginView from './views/login/LoginView';
import RegisterView from './views/register/RegisterView';
import MentorGroupListView from './views/mentorGroupList/MentorGroupList';
import MentorGroupView from './views/mentorGroup/MentorGroupView';
import LandingPageView from './views/landingPage/LandingPage';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute';
import ProfileView from './views/profileView/ProfileView';
import UserView from './views/userView/UserView';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import LogoutView from './views/logout/LogoutView';
import FindCoMentorView from './views/findCoMentorView/FindCoMentorView';
import { UserContext, UserContextValue, UserContextUser } from './contexts/UserContext';
import MyMentorGroupView from './views/myMentorGroupView/MyMentorGroupView';
import AddActivityView from './views/addActivityView/AddActivityView';
import CompletedActivitiesView from './views/completedActivities/CompletedActivitiesView';
import GradeActivityView from './views/gradeActivityView/GradeActivityView';
import ActivitiesView from './views/activities/ActivitiesView';
import DeadlinesView from './views/deadlinesView/DeadlinesView';
import RedirectInfoView from './views/redirectInfoView/RedirectInfoView';

// Or Create your Own theme:
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#553FBC',
		},
		secondary: {
			main: '#3185FC',
		},
	},
});

function Root() {
	const [user, setUser] = React.useState<null | UserContextUser>(null);

	const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

	return (
		<MuiThemeProvider theme={theme}>
			<UserContext.Provider value={providerValue}>
				<Router>
					<Switch>
						<Route exact path="/" component={LandingPageView} />
						<Route exact path="/login" component={LoginView} />
						<Route exact path="/register" component={RegisterView} />
						<ProtectedRoute exact path="/member/mentor-group-list" component={MentorGroupListView} />
						<ProtectedRoute exact path="/member/mentor-group/:id" component={MentorGroupView} />
						<ProtectedRoute exact path="/member/my-mentor-group/" component={MyMentorGroupView} />
						<ProtectedRoute exact path="/member/profile" component={ProfileView} />
						<ProtectedRoute exact path="/member/find-co-mentor" component={FindCoMentorView} />
						<ProtectedRoute exact path="/member/user/:id" component={UserView} />
						<ProtectedRoute exact path="/member/activities" component={ActivitiesView} />
						<ProtectedRoute exact path="/member/redirect-info-view" component={RedirectInfoView} />
						<ProtectedRoute exact path="/logout" component={LogoutView} />
						<ProtectedRoute exact path="/admin/add-activity" component={AddActivityView} />
						<ProtectedRoute exact path="/admin/grade-activity" component={GradeActivityView} />
						<ProtectedRoute exact path="/admin/completed-activities" component={CompletedActivitiesView} />
						<ProtectedRoute exact path="/admin/deadlines" component={DeadlinesView} />
					</Switch>
				</Router>
			</UserContext.Provider>
		</MuiThemeProvider>
	);
}

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
