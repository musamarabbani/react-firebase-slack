import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { firebase } from '../firebase';

class DirectMessages extends React.Component {
  state = {
    user: this.props.currentUser,
    users: [],
    userRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/conected'),
    presenceRef: firebase.database().ref('presence')
  };

  componentDidMount() {
    this.addEventListener(this.state.user.uid);
  }

  addEventListener = (currentUserUid) => {
    let loadedUsers = [];
    this.state.userRef.on('child_added', (snap) => {
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });
    this.state.connectedRef.on('value', (snap) => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });
    this.state.presenceRef.on('child_added', (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });
    this.state.presenceRef.on('child_removed', (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };
  addStatusToUser = (userId, connected = true) => {
    const updatedUser = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUser });
  };
  isUserOnline = (user) => user.status === 'online';
  render() {
    const { users } = this.state;
    return (
      <Menu.Menu>
        <Menu.Item>
          <span>
            <Icon nme="mail" />
            DIRECT MESSAGES
          </span>
          ({users.length})
        </Menu.Item>
        {users.map((user) => (
          <Menu.Item
            key={user.uid}
            style={{
              opacity: '0.7',
              fontStyle: 'italic'
            }}
            onClick={() => console.log('user', user)}
          >
            <Icon name="circle" color={this.isUserOnline(user) ? 'green' : 'red'} />@{user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default DirectMessages;
