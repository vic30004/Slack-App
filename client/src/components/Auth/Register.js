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

export default class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
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
    e.preventDefault();

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                console.log('user saved');
              });
            })
            .catch(err => {
              console.log(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false
              });
            });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    } else {
      return;
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        avatar: createdUser.user.photoURL
      });
  };

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
      username,
      email,
      passwordConfirmation,
      password,
      errors,
      loading
    } = this.state;
    return (
      <div>
        <Grid textAlign='center' verticalAlign='middle' className='app'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h1' icon color='red' textAlign='center'>
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
                <Form.Input
                  fluid
                  name='passwordConfirmation'
                  icon='repeat'
                  iconPosition='left'
                  placeholder='Confirm Password'
                  value={passwordConfirmation}
                  onChange={this.handleChange}
                  className={this.handleInputError(errors, 'password')}
                  type='password'
                />

                <Button
                  disabled={loading}
                  className={loading ? 'loading' : ''}
                  color='yellow'
                  fluid
                  size='large'
                >
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
