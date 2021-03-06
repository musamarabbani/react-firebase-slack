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
import AuthGuard from './AuthGuard';

class AppRoutes extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user);
      } else {
        this.props.history.push('/login');
        this.props.clearUser();
      }
    });
  }
  componentDidUpdate() {
    if (this.props.user && this.props.location.pathname === '/login') {
      this.props.history.push('/');
    }
  }
  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <AuthGuard auth={this.props.user} component={App} exact path="/" />
        <Route component={Login} path="/login" />
        <Route component={Register} path="/register" />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}

const mapStateFromProps = (state) => ({
  isLoading: state.user.isLoading,
  user: state.user.currentUser,
});
export default connect(mapStateFromProps, { setUser, clearUser })(withRouter(AppRoutes));
