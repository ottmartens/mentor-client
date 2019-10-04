import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Route  } from 'react-router-dom'
import LandingPageView from './Views/LandingPage/LandingPageView';
import MentorGroupListView from './Views/MentorGroupList/MentorGroupListView';

function Root() {
return <Router>
    <Route exact path="/" component={LandingPageView}/>
    <Route exact path="/mentor-group-list" component={MentorGroupListView}/>
        </Router>
}



ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
