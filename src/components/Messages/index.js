import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { firebase } from '../firebase';
import MessagesHeader from './MessageHeader';
import MessageForm from './MessageForm';
import Message from './Message';

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    progressBar: false
  };
  componentDidMount() {
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListeners(channel.id);
    }
  }
  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on('child_added', (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messagesLoading: false,
        messages: loadedMessages
      });
    });
  };
  isProgressBarVisible = (percent) => {
    if (percent > 0) this.setState({ progressBar: true });
  };
  displayMessages = (messages) => messages.length > 0 && messages.map((message) => <Message message={message} user={this.state.user} />);

  displayChannelname = (channel) => (channel ? `#${channel.name}` : '');
  render() {
    const { messagesRef, channel, user, messages, messagesLoading, progressBar } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader channelName={this.displayChannelname(channel)} />

        <Segment>
          <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>{this.displayMessages(messages)}</Comment.Group>
        </Segment>

        <MessageForm messagesRef={messagesRef} currentUser={user} currentChannel={channel} isProgressBarVisible={this.isProgressBarVisible} />
      </React.Fragment>
    );
  }
}

export default Messages;
