import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';
import FileModal from './FileModal'
export class MessageForm extends Component {
  state = {
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    modal: false
  };


  openModal =()=>{
      this.setState({modal:true})
  }
  closeModal =()=>{
      this.setState({modal:false})
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      },
      content: this.state.message
    };
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
          this.setState({ loading: false, message: '', errors: [] });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      });
    }
  };

  render() {

    const { errors,message,loading,modal } = this.state;
    return (
      <Segment className='message__form'>
        <Input
          fluid
          name='message'
          style={{ marginBottom: '0.7em' }}
          value={message}
          label={<Button icon={'add'}/>}
          labelPosition='left'
          placeholder='Write your message'
          onChange={this.handleChange}
          className={
            errors.some(error => error.message.includes('message'))
              ? 'error'
              : ''
          }
        />
        <Button.Group icon widths="2">
          <Button
            color='orange'
            content='Add Reply'
            disabled={loading}
            labelPosition='left'
            icon='edit'
            onClick={this.sendMessage}
          />
          <Button
            color='teal'
            onClick={this.openModal}
            content='Upload Media'
            labelPosition='right'
            icon='cloud upload'
          />
          <FileModal modal={modal} closeModal={this.closeModal}/>
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
