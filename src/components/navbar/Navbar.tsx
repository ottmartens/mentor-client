import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { User, UserRole, HasUserProps } from '../../types';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	list: {
		width: 250,
		height: '100%',
		background: theme.palette.secondary.main,
		color: '#ffffff',
	},
	nav: {
		background: theme.palette.secondary.main,
	},
	button: {
		color: '#ffffff',
	},
	profileButton: {
		position: 'absolute',
		right: 0,
	},
	profileIcon: {
		color: '#ffffff',
	},
}));

type NavItem = {
	label: string;
	url: string;
};

export default function Navbar({ user }: HasUserProps) {
	const classes = useStyles();
	const routes = getPossibleRoutes(user);
	const [state, setState] = React.useState({
		left: false,
	});

	const toggleDrawer = (side, open) => (event) => {
		setState({ ...state, [side]: open });
	};

	const sideList = (side) => (
		<div className={classes.list} role="presentation" onClick={toggleDrawer(side, false)}>
			<List>
				{routes.map((route, index) => (
					<ListItem button component="a" key={index} href={route.url}>
						<ListItemText primary={route.label} />
					</ListItem>
				))}
			</List>
		</div>
	);

	return (
		<div className={classes.nav}>
			<Button onClick={toggleDrawer('left', true)} className={classes.button}>
				<MenuIcon />
			</Button>
			<Button className={classes.profileButton}>
				<Link to="/member/profile">
					<AccountCircleIcon className={classes.profileIcon} />
				</Link>
			</Button>
			<SwipeableDrawer open={state.left} onClose={toggleDrawer('left', false)} onOpen={toggleDrawer('left', true)}>
				{sideList('left')}
			</SwipeableDrawer>
		</div>
	);
}

function getPossibleRoutes(user: User): NavItem[] {
	switch (user.role) {
		case UserRole.MENTEE:
			return [
				{ label: 'My group', url: '/member/mentor-group/:id' },
				{ label: 'All groups', url: '/member/mentor-group-list' },
				{ label: 'Activities', url: '/member/acitivities' },
				{ label: 'Log out', url: '/member/log-out' },
			];

		case UserRole.MENTOR:
			return [
				{ label: 'My group', url: '/member/mentor-group/:id' },
				{ label: 'All groups', url: '/member/mentor-group-list' },
				{ label: 'Activities', url: '/member/acitivities' },
				{ label: 'Log out', url: '/member/log-out' },
			];

		case UserRole.ADMIN:
			return [
				{ label: 'Groups', url: '/admin/mentor-groups' },
				{ label: 'Grade activities', url: '/admin/grade-activities' },
				{ label: 'Activities', url: '/admin/acitivities' },
				{ label: 'Deadlines', url: '/admin/deadlines' },
				{ label: 'Vefify Users', url: '/admin/verify-users' },
				{ label: 'Log out', url: '/admin/log-out' },
			];
		default:
			return [];
	}
}
