import React from 'react';
import { Header, Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';
import { firebase } from '../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../redux/actions';
import { connect } from 'react-redux';

class Channels extends React.Component {
  state = {
    activeChannel: '',
    channel: null,
    user: this.props.currentUser,
    channels: [],
    notifications: [],
    channelName: '',
    channelDetails: '',
    modal: false,
    firstLoad: true,
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages')
  };

  componentDidMount() {
    this.addListeners();
  }
  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', (snap) => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationListener(snap.key);
    });
  };

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  addNotificationListener = (channelId) => {
    this.state.messagesRef.on('value', (snap) => {
      if (this.state.channel) {
        this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;
    let index = notifications.findIndex((notification) => notification.id === channelId);

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  };
  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      let firstChannel = this.state.channels[0];
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  };

  setActiveChannel = (currentChannel) => {
    this.setState({ activeChannel: currentChannel });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;
  addChannel = () => {
    const { channelName, channelDetails, channelsRef, user } = this.state;
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: '' });
        this.closeModal();
      })
      .catch((err) => {
        console.log('err ==>', err);
      });
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };
  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.state.channel.id
    );
    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };
  displayChannel = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        style={{ opacity: 0.7 }}
        active={this.state.activeChannel.id === channel.id}
        name={channel.name}
        onClick={() => {
          this.changeChannel(channel);
        }}
      >
        #{channel.name}
        {this.getNotificationsCount(channel) && (
          <Label color="red">{this.getNotificationsCount(channel)}</Label>
        )}
      </Menu.Item>
    ));

  getNotificationsCount = (channel) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  };
  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannel(channels)}
        </Menu.Menu>
        <Modal basic size="small" open={modal} onClose={this.closeModal}>
          <Header>Add a Channel</Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  onChange={this.handleChange}
                  name="channelName"
                  label="Name of Channel"
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  onChange={this.handleChange}
                  name="channelDetails"
                  label="About the Channel"
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button className="cursor-pointer" color="green" inverted onClick={this.handleSubmit}>
              <Icon name="check" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);
