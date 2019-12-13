import React, { Component } from 'react'
import {Grid, Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react'
import {Link} from "react-router-dom"
export default class Register extends Component {
    state ={}

    handleChange = () =>{}
    render() {
        return (
            <div>
               <Grid textAlign='center' verticalAlign='middle' className="app">
                    <Grid.Column style={{maxWidth:450}}>
                        <Header as='h2' icon color='red' textAlign='center'>
                            <Icon name="desktop" color='orange'/>
                            Register For codeHub Chat! 
                        </Header>

                    <Form size="large">
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="Username" onChange={this.handleChange} type="text"/>
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email" onChange={this.handleChange} type="email"/>
                            <Form.Input fluid name="password" icon="key" iconPosition="left" placeholder="Password" onChange={this.handleChange} type="password"/>
                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Confirm Password" onChange={this.handleChange} type="password"/>
                            <Button color="yellow" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                <Message> Already a member?<Link to="/login">Login</Link> </Message>
                    </Grid.Column>
               
               </Grid>
            </div>
        )
    }
}
