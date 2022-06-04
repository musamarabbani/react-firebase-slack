import React from 'react';
import { Button, Modal, Input, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

class FileModal extends React.Component {
  state = { file: '', authorized: ['image/jpeg', 'image/png', 'image/webp'] };

  addFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };
  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };
  isAuthorized = (fileName) => this.state.authorized.includes(mime.lookup(fileName));
  clearFile = () => this.setState({ file: null });
  render() {
    const { modal, closeModal, file } = this.props;

    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input fluid label="File types: jpg, png" name="file" type="file" onChange={this.addFile} />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" />
            Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
