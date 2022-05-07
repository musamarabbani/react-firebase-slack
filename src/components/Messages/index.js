import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { firebase } from '../firebase';
import MessagesHeader from './MessageHeader';
import MessageForm from './MessageForm';

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser
  };
  render() {
    const { messagesRef, channel, user } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
        </Segment>

        <MessageForm messagesRef={messagesRef} currentUser={user} currentChannel={channel} />
      </React.Fragment>
    );
  }
}

export default Messages;
