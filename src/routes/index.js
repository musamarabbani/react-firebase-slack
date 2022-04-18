import React, { Component } from 'react';
import App from '@components/App';
import Login from '@components/Auth/Login';
import Register from '@components/Auth/Register';
import NotFound from '@components/404';
import { Switch, Route, withRouter } from 'react-router-dom';
import { firebase } from '../components/firebase';
import { setUser, clearUser } from '../redux/actions';
import { connect } from 'react-redux';
import Spinner from '../components/Spinner';

class AppRoutes extends Component {
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			console.log('user', user);
			if (user) {
				this.props.history.push('/');
				this.props.setUser(user);
			} else {
				debugger;
				this.props.clearUser();
				this.props.history.push('/login');
			}
		});
	}
	render() {
		return this.props.isLoading ? (
			<Spinner />
		) : (
			<Switch>
				<Route exact path='/' component={App} />
				<Route path='/login' component={Login} />
				<Route path='/register' component={Register} />
				<Route path='*' component={NotFound} />
			</Switch>
		);
	}
}

const mapStateFromProps = (state) => ({
	isLoading: state.user.isLoading,
});
export default connect(mapStateFromProps, { setUser, clearUser })(
	withRouter(AppRoutes)
);
