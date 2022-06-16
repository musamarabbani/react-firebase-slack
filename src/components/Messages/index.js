import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { firebase } from '../firebase';
import MessagesHeader from './MessageHeader';
import MessageForm from './MessageForm';
import Message from './Message';

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
    usersRef: firebase.database().ref('users'),
    privateChannel: this.props.isPrivateChannel,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    progressBar: false,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    isChannelStarred: false
  };
  componentDidMount() {
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListeners(channel.id);
      this.addUserStarsListener(channel.id, user.uid);
    }
  }
  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };
  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child('starred')
      .once('value')
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelIds);
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on('child_added', (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messagesLoading: false,
        messages: loadedMessages
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
    this.setState({ numUniqueUsers });
  };
  isProgressBarVisible = (percent) => {
    if (percent > 0) this.setState({ progressBar: true, searchLoading: true });
  };
  displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => <Message message={message} user={this.state.user} />);
  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value, searchLoading: true }, () => {
      this.handleSearchMessages();
    });
  };
  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => {
      this.setState({ searchLoading: false });
    }, 500);
  };
  handleStar = () => {
    this.setState(
      (prevState) => ({
        isChannelStarred: !prevState.isChannelStarred
      }),
      () => this.starChannel()
    );
  };
  starChannel = () => {
    const { isChannelStarred, channel, usersRef } = this.state;
    if (isChannelStarred) {
      usersRef.child(`${this.state.user.uid}/starred`).update({
        [channel.id]: {
          name: channel.name,
          details: channel.details,
          createdBy: {
            name: channel.createdBy.name,
            avatar: channel.createdBy.avatar
          }
        }
      });
    } else {
      usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove((err) => {
          if (err !== null) {
            console.error('unstarred channel err', err);
          }
        });
    }
  };
  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };
  displayChannelname = (channel) => {
    return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
  };

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      progressBar,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      privateChannel,
      isChannelStarred
    } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelname(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment>
          <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentUser={user}
          currentChannel={channel}
          isProgressBarVisible={this.isProgressBarVisible}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef()}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
