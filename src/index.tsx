import React from "react";
import ReactDOM from "react-dom";
import "./themes/main.scss";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginView from "./views/login/LoginView";
import RegisterView from "./views/register/RegisterView";
import MentorGroupListView from "./views/mentorGroupList/MentorGroupList";

import MentorGroupView from "./views/mentorGroup/MentorGroupView";
import LandingPageView from "./views/LandingPage/LandingPage";
function Root() {
	return (
		<Router>
			<Route exact path="/" component={LandingPageView} />
			<Route exact path="/login" component={LoginView} />
			<Route exact path="/register" component={RegisterView} />
			<Route
				exact
				path="/mentor-group-list"
				component={MentorGroupListView}
			/>
			<Route exact path="/mentor-group/:id" component={MentorGroupView} />
		</Router>
	);
}

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
