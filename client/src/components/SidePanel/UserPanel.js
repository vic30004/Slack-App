import React, { Component } from 'react';
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';

export class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    uploadCroppedImage: '',
    channel: this.props.currentChannel,
    channelRef: firebase.database().ref('channel'),
    blob: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    messagesRef: firebase.database().ref('messages'),
    metadata: {
      contentType: 'image/jpeg'
    },
    usersRef: firebase.database().ref('users')
  };


  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.currentUser });
  }


  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  dropDownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Singed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: 'avatar',
      text: <span onClick={this.openModal}>Change Avatar</span>
    },
    {
      key: 'signout',
      text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
  ];

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('signed out!'));
  };

  handleChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;
    storageRef
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metadata)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadURL => {
          this.setState({ uploadCroppedImage: downloadURL }, () =>
            this.changeAvatar()
          );
        });
      });
  };

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadCroppedImage
      })
      .then(() => {
        console.log('PhotoURL updated');
        this.closeModal();
      })
      .catch(err => {
        console.error(err);
      });

    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadCroppedImage })
      .then(() => {
        console.log('User avatar updated');
      })
      .catch(err => {
        console.error(err);
      });

  };

  handleCropImage = () => {
    if (this.avatarrEditor) {
      this.avatarrEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob
        });
      });
    }
  };

  render() {
    const { user, modal, previewImage, croppedImage } = this.state;
    const { primaryColor } = this.props;
    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header inverted floated='left' as='h3'>
              <Icon name='code' />
              <Header.Content>codeHub Chat</Header.Content>
            </Header>
          </Grid.Row>

          <Header style={{ padding: '0.25em' }} as='h4' inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced='right' avatar />
                  {user.displayName}
                </span>
              }
              options={this.dropDownOptions()}
            />
          </Header>
        </Grid.Column>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              onChange={this.handleChange}
              fluid
              type='file'
              label='New Avatar'
              name='previewImage'
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className='ui center aligned grid'>
                  {previewImage && (
                    <AvatarEditor
                      ref={node => (this.avatarrEditor = node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {croppedImage && (
                    <Image
                      style={{ margin: '3.5em auto' }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button color='green' inverted onClick={this.uploadCroppedImage}>
                <Icon name='save' />
                Change Avatar
              </Button>
            )}
            <Button color='green' inverted onClick={this.handleCropImage}>
              <Icon name='image' />
              Preview
            </Button>
            <Button color='red' inverted onClick={this.closeModal}>
              <Icon name='remove' />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid>
    );
  }
}

const maspStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default connect(maspStateToProps)(UserPanel);
