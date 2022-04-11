import React from 'react';
import App from '@components/App';
import Login from '@components/Auth/Login';
import Register from '@components/Auth/Register';
import NotFound from '@components/404';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const AppRoutes = () => {
	return (
		<Router>
			<Switch>
				<Route exact path='/' component={App} />
				<Route path='/login' component={Login} />
				<Route path='/register' component={Register} />
				<Route path='*' component={NotFound} />
			</Switch>
		</Router>
	);
};

export default AppRoutes;
