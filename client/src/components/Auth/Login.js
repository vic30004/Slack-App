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
import md5 from 'md5';

export default class Login extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };

  

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(signedInUser =>{
          console.log(signedInUser)
      })
      .catch(err =>{
          console.log(err)
          this.setState({
              errors: this.state.errors.concat(err),
              loading: false
          })
      })
        
    } else {
      return;
    }
  };

  isFormValid= ({email,password})=>email && password;

 

  handleInputError = (errors, inputName) => {
    return errors.some(error =>
      error.message
        .toLowerCase()
        .includes(inputName)
    )
      ? 'error'
      : '';
  };
  render() {
    const {
      email,
      password,
      errors,
      loading
    } = this.state;
    return (
      <div>
        <Grid textAlign='center' verticalAlign='middle' className='app'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h1' icon color='violet' textAlign='center'>
              <Icon name='code branch' color='violet' />
              Login To codeHub Chat!
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
                  name='email'
                  icon='mail'
                  iconPosition='left'
                  placeholder='Email'
                  onChange={this.handleChange}
                  value={email}
                  className={this.handleInputError(errors, 'email')}
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
                  className={this.handleInputError(errors, 'password')}
                  type='password'
                />
                
                <Button
                  disabled={loading}
                  className={loading ? 'loading' : ''}
                  color='violet'
                  fluid
                  size='large'
                >
                  Submit
                </Button>
              </Segment>
            </Form>

            <Message>
              {' '}
              Not a member yet?<Link to='/register'>Register</Link>{' '}
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

