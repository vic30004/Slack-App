import React, { Component } from 'react'
import {Segment, Button, Input} from 'semantic-ui-react'

export class MessageForm extends Component {
    render() {
        return (
         <Segment className="message__form">
            <Input fluid name="message" style={{marginBottom: '0.7em'}} labelPosition="left" placeholder="Write your message"/>
         <Button.Group>
            <Button color ="orange" content="Add Reply" labelPosition="left" icon="edit"/>
         <Button color="teal" content="Upload Media" labelPosition="right" icon="cloud upload"/>
         </Button.Group>
         </Segment>
        )
    }
}

export default MessageForm
