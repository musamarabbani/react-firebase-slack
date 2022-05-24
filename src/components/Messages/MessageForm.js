import React from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import { firebase } from '../firebase';
import FileModal from './FileModal';
import uuidv4 from 'uuid/v4';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {
  state = {
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false,
    uploadState: '',
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  createMessage = (fileUrl) => {
    const { user } = this.state;
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    };
    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = this.state.message;
    }
    return message;
  };
  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel } = this.state;
    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ message: '', loading: false, errors: [] });
        })
        .catch((err) => {
          console.log('err', err);
          this.setState({ loading: false, errors: this.state.errors.concat(err) });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      });
    }
  };
  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;
    this.setState(
      {
        uploadState: 'uploading',
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          'state_changed',
          (snap) => {
            const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            this.setState({ percentUploaded });
            this.props.isProgressBarVisible(percentUploaded);
          },
          (err) => {
            console.error('err ==>', err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: 'error',
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
              this.sendFileMessage(downloadUrl, ref, pathToUpload);
            });
          },
          (err) => {
            console.error('err ==>', err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: 'error',
              uploadTask: null
            });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: 'done' });
      })
      .catch((err) => {
        console.log('err ==>', err);
        this.setState({
          errors: this.state.errors.concat(err),
          uploadState: 'error',
          uploadTask: null
        });
      });
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  render() {
    const { message, errors, loading, modal, uploadState, percentUploaded } = this.state;
    return (
      <React.Fragment>
        <Segment className="message__form">
          <Input
            fluid
            name="message"
            value={message}
            onChange={this.handleChange}
            style={{ marginBottom: '0.7em' }}
            label={<Button icon={'add'} />}
            labelPosition="left"
            placeholder="Write your message"
            className={errors.some((error) => error.message.includes('message')) ? 'error' : ''}
          />
          <Button.Group icon widths="2">
            <Button disabled={loading} onClick={this.sendMessage} color="orange" content="Add Reply" labelPosition="left" icon="edit" />
            <Button
              disabled={uploadState === 'uploading'}
              color="teal"
              content="Upload Media"
              labelPosition="right"
              icon="cloud upload"
              onClick={this.openModal}
            />
          </Button.Group>
        </Segment>
        <ProgressBar uploadState={uploadState} percentUploaded={percentUploaded} />
        <FileModal modal={modal} closeModal={this.closeModal} uploadFile={this.uploadFile} />
      </React.Fragment>
    );
  }
}

export default MessageForm;
