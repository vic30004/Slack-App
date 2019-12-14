import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagessHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';
export class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser
  };
  render() {

    const { messagesRef,channel } = this.state;
    const {currentUser} = this.props
    return (
      <Fragment>
        <MessagessHeader />
        <Segment>
          <Comment.Group className='messages'></Comment.Group>
        </Segment>
        <MessageForm 
        currentChannel={channel}
        messagesRef={messagesRef}
        currentUser={currentUser} />
      </Fragment>
    );
  }
}

export default Messages;
