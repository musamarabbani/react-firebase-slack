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
import { Link } from 'react-router-dom';
import { firebase } from '@components/firebase';
import md5 from 'md5';

class Register extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		passwordConfirmation: '',
		errors: [],
		loading: false,
		usersRef: firebase.database().ref('users'),
	};
	isFormValid = () => {
		let errors = [];
		let error;
		if (this.isFormEmpty(this.state)) {
			error = { message: 'Fill in all the fields' };
			this.setState({ errors: errors.concat(error) });
		} else if (!this.isPasswordValid(this.state)) {
			error = { message: 'Password is invalid' };
			this.setState({ errors: errors.concat(error) });
		} else return true;
	};
	isPasswordValid = ({ password, passwordConfirmation }) => {
		if (password.length < 6 || passwordConfirmation.length < 6) {
			return false;
		} else if (password !== passwordConfirmation) {
			return false;
		} else {
			return true;
		}
	};
	isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
		return (
			!username.length ||
			!email.length ||
			!password.length ||
			!passwordConfirmation.length
		);
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
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then((createdUser) => {
				createdUser.user
					.updateProfile({
						displayName: this.state.username,
						photoURL: `http://gravatar.com/avatar/${md5(
							createdUser.user.email
						)}?d=identicon`,
					})
					.then(() => {
						this.saveUser(createdUser).then(() => {
							console.log('user saved!');
						});
					})
					.catch((err) => {
						console.log('err', err);
						this.setState({
							errors: this.state.errors.concat(err),
							loading: false,
						});
					});
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
	saveUser = (createdUser) => {
		return this.state.usersRef.child(createdUser.user.uid).set({
			name: createdUser.user.displayName,
			avatar: createdUser.user.photoURL,
		});
	};
	render() {
		const { username, email, password, passwordConfirmation, errors, loading } =
			this.state;
		return (
			<Grid textAlign='center' verticalAlign='middle'>
				<Grid.Column style={{ maxWidth: 450 }}>
					<Header as='h2' icon color='orange' textAlign='center'>
						<Icon name='puzzle piece' color='orange' />
						Register From DevChat
					</Header>
					<Form onSubmit={this.handleSubmit} size='large'>
						<Segment stacked>
							<Form.Input
								fluid
								name='username'
								icon='user'
								iconPosition='left'
								placeholder='Username'
								onChange={this.handleChange}
								type='text'
								value={username}
							/>
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
							<Form.Input
								fluid
								name='passwordConfirmation'
								icon='repeat'
								iconPosition='left'
								placeholder='Password Confirmation'
								onChange={this.handleChange}
								type='password'
								value={passwordConfirmation}
								className={this.handleInputError(errors, 'password')}
							/>
							<Button
								color='orange'
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
						Already a user? <Link to='/login'>Login</Link>
					</Message>
				</Grid.Column>
			</Grid>
		);
	}
}

export default Register;
