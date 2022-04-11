import React from 'react';
import App from '../components/App';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import NotFound from '../components/404';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AppRoutes = () => {
	return (
		<Router>
			<Routes>
				<Route exact path='/' element={<App />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</Router>
	);
};

export default AppRoutes;
