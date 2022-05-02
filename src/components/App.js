import React from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './ColorPanel';
import Messages from './Messages';
import MetaPanel from './MetaPanel';
import SidePanel from './SidePanel';
import { connect } from 'react-redux';
import './App.css';

const App = ({ currentUser }) => (
  <Grid columns="equal" className="app" style={{ background: '#eee' }}>
    <ColorPanel />
    <SidePanel currentUser={currentUser} />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>
);

const mapStateFromProps = ({ user }) => ({
  currentUser: user.currentUser
});

export default connect(mapStateFromProps)(App);
