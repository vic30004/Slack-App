import React, { Component, Fragment } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

export class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modal: false
  };
  
  componentDidMount(){
      this.addListeners();
  }


  addListeners = ()=>{
      let loadedChannels = [];
      this.state.channelsRef.on('child_added', snap=>{
          loadedChannels.push(snap.val());
          console.log(loadedChannels)
      })
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createBy: {
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
        console.log('Channel Added');
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });
  render() {
    const { channels, modal } = this.state;
    return (
      <Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name='exchange' />
              CHANNELS
            </span>{' '}
            ({channels.length})<Icon name='add' onClick={this.openModal} />
          </Menu.Item>
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Add a Channel</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <Input
                    fluid
                    label='Name of Channel'
                    name='channelName'
                    onChange={this.handleChange}
                  />
                </Form.Field>

                <Form.Field>
                  <Input
                    fluid
                    label='About the Channel'
                    name='channelDetails'
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' inverted onClick={this.handleSubmit}>
                <Icon name='checkmark' />
                Add
              </Button>
              <Button color='red' inverted onClick={this.closeModal}>
                <Icon name='remove' />
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Menu.Menu>
      </Fragment>
    );
  }
}

export default Channels;
