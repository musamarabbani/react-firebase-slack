import React from 'react';
import { Menu } from 'semantic-ui-react';
import Channels from './Channels';
import UserPanel from './UserPanel';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

class SidePanel extends React.Component {
  render() {
    const { currentUser, currentChannel } = this.props;
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
      >
        <UserPanel currentUser={currentUser} currentChannel={currentChannel} />
        <Starred />
        <Channels currentUser={currentUser} currentChannel={currentChannel} />
        <DirectMessages currentUser={currentUser} currentChannel={currentChannel} />
      </Menu>
    );
  }
}

export default SidePanel;
