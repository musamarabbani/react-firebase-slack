import React from 'react';
import { Header, Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import { firebase } from '../firebase';
import { setCurrentChannel } from '../../redux/actions';
import { connect } from 'react-redux';

class Channels extends React.Component {
  state = {
    activeChannel: '',
    firstLoad: true,
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDetails: '',
    modal: false,
    channelsRef: firebase.database().ref('channels')
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
    });
  };

  removeListeners = () => {
    this.state.channelsRef.off();
  };
  setFirstChannel = () => {
    if (this.state.firstLoad && this.state.channels.length > 0) {
      let firstChannel = this.state.channels[0];
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
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
    this.props.setCurrentChannel(channel);
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
          this.setActiveChannel(channel);
        }}
      >
        #{channel.name}
      </Menu.Item>
    ));
  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
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
                <Input fluid onChange={this.handleChange} name="channelName" label="Name of Channel" />
              </Form.Field>
              <Form.Field>
                <Input fluid onChange={this.handleChange} name="channelDetails" label="About the Channel" />
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

export default connect(null, { setCurrentChannel })(Channels);
