import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagessHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';
import Message from './Message';

export class Messages extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref('privateMessages'),
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: []
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };
  countUniqueUsers = messages => {
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

  handleSearchChange = e => {
    this.setState(
      {
        searchTerm: e.target.value,
        searchLoading: true
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    this.setState({ searchResults });
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef()
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        style={{ width: '100vw' }}
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => {
    return channel
      ? `${this.state.privateChannel ? '@' : '#'}${channel.name}`
      : '';
  };

  getMessagesRef = ()=>{
    const {messagesRef, privateMessagesRef, privateChannel} = this.state;
    return privateChannel ? privateMessagesRef : messagesRef
  }

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      privateChannel
    } = this.state;
    return (
      <Fragment>
        <MessagessHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          isPrivateChannel={privateChannel}
          handleSearchChange={this.handleSearchChange}
        />
        <Segment>
          <Comment.Group className='messages'>
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          currentChannel={channel}
          messagesRef={messagesRef}
          currentUser={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </Fragment>
    );
  }
}

export default Messages;
