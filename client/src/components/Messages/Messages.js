import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import MessagessHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import firebase from '../../firebase';
import Message from './Message'


export class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages:[],
    messagesLoading:true,
    numUniqueUsers:'',
    searchTerm:'',
    searchLoading:false
  };

  componentDidMount(){
    const {channel,user}= this.state;

    if(channel && user) {
      this.addListeners(channel.id)
    }
  }


  addListeners =(channelId)=>{
    this.addMessageListener(channelId)
  }
  countUniqueUsers = messages=>{
    const uniqueUsers = messages.reduce((acc, message)=>{
      if(!acc.includes(message.user.name)){
        acc.push(message.user.name)
      }
      return acc;
    },[])
    const plural = uniqueUsers.length>1  || uniqueUsers.length===0

    const numUniqueUsers =  `${uniqueUsers.length} user${plural ? "s":''}`
    this.setState({numUniqueUsers})
  }

  handleSearchChange =e =>{
    this.setState({
      searchTerm: e.target.value,
      searchLoading: true
    });

  }

  addMessageListener=(channelId)=>{
    let loadedMessages=[];
    this.state.messagesRef.child(channelId).on('child_added', snap=>{
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages)
    })
  }

  displayMessages=(messages)=>(
    messages.length>0 && messages.map(message =>(
      <Message 
      key={message.timestamp}
      message={message}
      user={this.state.user}


      />
    ))
    
  )

    displayChannelName= channel =>channel? `${channel.name}`:'';

  render() {

    const { messagesRef,channel,user, messages,numUniqueUsers } = this.state;
    return (
      <Fragment>
        <MessagessHeader channelName={this.displayChannelName(channel)}  numUniqueUsers={numUniqueUsers} handleSearchChange={this.handleSearchChange}/>
        <Segment>
          <Comment.Group className='messages'>
          {this.displayMessages(messages)}

          </Comment.Group>
        </Segment>
        <MessageForm 
        currentChannel={channel}
        messagesRef={messagesRef}
        currentUser={user} />
      </Fragment>
    );
  }
}

export default Messages;
