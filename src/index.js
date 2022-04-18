import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import Provider from 'react-redux/lib/components/Provider';
import store from './redux/store';
import 'semantic-ui-css/semantic.min.css';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Provider store={store}>
				<Routes />
			</Provider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
