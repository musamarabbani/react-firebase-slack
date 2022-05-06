import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends React.Component {
  state = { channels: [], channelName: '', channelDetails: '', modal: false };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu>
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
        </Menu.Menu>
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
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
            <Button className="cursor-pointer" color="green" inverted>
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

export default Channels;
