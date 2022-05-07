import React from 'react';
import { Grid } from 'semantic-ui-react';
import ColorPanel from './ColorPanel';
import Messages from './Messages';
import MetaPanel from './MetaPanel';
import SidePanel from './SidePanel';
import { connect } from 'react-redux';
import './App.css';

const App = ({ currentUser, currentChannel }) => (
  <Grid columns="equal" className="app" style={{ background: '#eee' }}>
    <ColorPanel />
    <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser} />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages key={currentChannel && currentChannel.id} currentUser={currentUser} currentChannel={currentChannel} />
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel />
    </Grid.Column>
  </Grid>
);

const mapStateFromProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel
});

export default connect(mapStateFromProps)(App);
