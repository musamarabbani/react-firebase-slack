import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class AuthGuard extends React.Component {
  render() {
    const { auth, component: Component } = this.props;
    return <Route render={(rest) => (auth ? <Component {...rest} /> : <Redirect to="/login" />)} />;
  }
}

const mapStateFromProps = (state) => ({
  isLoading: state.user.isLoading,
  user: state.user.currentUser,
});

export default connect(mapStateFromProps)(withRouter(AuthGuard));
