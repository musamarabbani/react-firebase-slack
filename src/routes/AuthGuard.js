import React from 'react';
import { Route, Redirect } from 'react-router-dom';

class AuthGuard extends React.Component {
	render() {
		const { auth, component: Component } = this.props;
		return (
			<Route
				render={(rest) =>
					auth ? <Component {...rest} /> : <Redirect to='/login' />
				}
			/>
		);
	}
}

export default AuthGuard;
