import React, { Component } from 'react';
import {
	Grid,
	Form,
	Button,
	Segment,
	Header,
	Message,
	Icon,
} from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { firebase } from '@components/firebase';
import { connect } from 'react-redux';

class Login extends Component {
	state = {
		email: '',
		password: '',
		errors: [],
		loading: false,
		usersRef: firebase.database().ref('users'),
	};
	componentDidMount() {
		if (this.props.user) {
			console.log('called');
			this.props.history.push('/');
		}
	}
	isFormValid = () => {
		let errors = [];
		let error;
		if (this.isFormEmpty(this.state)) {
			error = { message: 'Fill in all the fields' };
			this.setState({ errors: errors.concat(error) });
		} else return true;
	};
	isFormEmpty = ({ email, password }) => {
		return !email.length || !password.length;
	};
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.isFormValid()) this.setState({ loading: true, errors: [] });
		firebase
			.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then((signedInUser) => {
				this.setState({
					loading: false,
				});
				this.props.history.push('/');
			})
			.catch((error) => {
				this.setState({
					loading: false,
					errors: this.state.errors.concat(error),
				});
			});
	};
	displayErrors = (errors) =>
		errors.map((error, index) => <p key={index}>{error.message}</p>);

	handleInputError = (errors, inputName) => {
		return errors.some((error) =>
			error.message.toLowerCase().includes(inputName)
		)
			? 'error'
			: '';
	};

	render() {
		const { email, password, errors, loading } = this.state;
		return (
			<Grid textAlign='center' verticalAlign='middle' className='app'>
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as='h2' icon color='violet' textAlign='center'>
						<Icon name='puzzle piece' color='violet' />
						Login From DevChat
					</Header>
					<Form onSubmit={this.handleSubmit} size='large'>
						<Segment stacked>
							<Form.Input
								fluid
								name='email'
								icon='mail'
								iconPosition='left'
								placeholder='Email Address'
								onChange={this.handleChange}
								type='email'
								value={email}
								className={this.handleInputError(errors, 'email')}
							/>
							<Form.Input
								fluid
								name='password'
								icon='lock'
								iconPosition='left'
								placeholder='Password'
								onChange={this.handleChange}
								type='password'
								value={password}
								className={this.handleInputError(errors, 'password')}
							/>
							<Button
								color='violet'
								disabled={loading}
								className={loading ? 'loading' : ''}
								fluid
								size='large'
							>
								Submit
							</Button>
						</Segment>
					</Form>
					{errors.length > 0 && (
						<Message error>{this.displayErrors(errors)}</Message>
					)}
					<Message>
						Already a user? <Link to='/register'>Register</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

const mapStateFromProps = (state) => ({
	user: state.user.currentUser,
});
export default connect(mapStateFromProps)(withRouter(Login));
