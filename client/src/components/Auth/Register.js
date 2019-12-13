import React, { Component } from 'react';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
export default class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: []
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      // Throw error
      error = { message: 'Fill in all fields!' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      // throw error
      error = { message: 'Password is Invalid' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      // from is valid
      return true;
    }
  };

  isFormEmpty = ({ username, email, passwordConfirmation, password }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    if (this.isFormValid()) {
      e.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      return;
    }
  };
  render() {
    const {
      username,
      email,
      passwordConfirmation,
      password,
      errors
    } = this.state;
    return (
      <div>
        <Grid textAlign='center' verticalAlign='middle' className='app'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' icon color='red' textAlign='center'>
              <Icon name='desktop' color='orange' />
              Register For codeHub Chat!
            </Header>
            {errors.length > 0 && (
                <Message error>
                  <h3>Error</h3>
                  {this.displayErrors(errors)}
                </Message>
              )}
            <Form onSubmit={this.handleSubmit} size='large'>
              <Segment stacked>
                <Form.Input
                  fluid
                  name='username'
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  onChange={this.handleChange}
                  value={username}
                  type='text'
                />
                <Form.Input
                  fluid
                  name='email'
                  icon='mail'
                  iconPosition='left'
                  placeholder='Email'
                  onChange={this.handleChange}
                  value={email}
                  type='email'
                />
                <Form.Input
                  fluid
                  name='password'
                  icon='key'
                  iconPosition='left'
                  placeholder='Password'
                  onChange={this.handleChange}
                  value={password}
                  type='password'
                />
                <Form.Input
                  fluid
                  name='passwordConfirmation'
                  icon='repeat'
                  iconPosition='left'
                  placeholder='Confirm Password'
                  value={passwordConfirmation}
                  onChange={this.handleChange}
                  type='password'
                />
                <Button color='yellow' fluid size='large'>
                  Submit
                </Button>
              </Segment>
            </Form>
            
            <Message>
              {' '}
              Already a member?<Link to='/login'>Login</Link>{' '}
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
