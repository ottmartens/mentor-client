import React from 'react';
import ReactDOM from 'react-dom';
import './themes/main.scss';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginView from './views/login/LoginView';
import RegisterView from './views/register/RegisterView';
import MentorGroupListView from './views/mentorGroupList/MentorGroupList';
import MentorGroupView from './views/mentorGroup/MentorGroupView';
import LandingPageView from './views/landingPage/LandingPage';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute';
import ProfileView from './views/profileView/ProfileView';
import Navbar from './components/navbar/Navbar';

function Root() {
	return (
		<Router>
			<Navbar />
			<Route exact path="/" component={LandingPageView} />
			<Route exact path="/login" component={LoginView} />
			<Route exact path="/register" component={RegisterView} />
			<ProtectedRoute exact path="/member/mentor-group-list" component={MentorGroupListView} />
			<ProtectedRoute exact path="/member/mentor-group/:id" component={MentorGroupView} />
			<ProtectedRoute exact path="/member/profile" component={ProfileView} />
		</Router>
	);
}

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
