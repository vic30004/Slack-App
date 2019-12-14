import React, { Component,Fragment } from 'react'
import {Segment,Comment} from 'semantic-ui-react'
import MessagessHeader from './MessagesHeader'
import MessageForm from './MessageForm'
export class Messages extends Component {
    render() {
        return (
           <Fragment>
            <MessagessHeader/>
           <Segment>
           
            <Comment.Group className="messages">
            
            
            </Comment.Group>
           </Segment>
           <MessageForm/>
           </Fragment>
        )
    }
}

export default Messages
