import React, { Component } from 'react'
import {Grid,Header,Icon, Dropdown,Image} from 'semantic-ui-react'
import {connect} from 'react-redux'
import firebase from '../../firebase'

export class UserPanel extends Component {
    state={
        user:this.props.currentUser,
    

    }

    componentWillReceiveProps(nextProps){
        this.setState({user: nextProps.currentUser})
    }
    dropDownOptions = ()=>[{
        key:'user',
        text:<span>Singed in as <strong>{this.state.user.displayName}</strong></span>,
        disabled:true
    },
    {
        key:'avatar',
        text: <span>Change Avatar</span>
    },
    {
        key:'signout',
        text: <span onClick={this.handleSignOut}>Sign Out</span>
    }


]

handleSignOut =()=>{
    firebase
    .auth()
    .signOut()
    .then(()=>console.log('signed out!'))
}


    render() {
        const {user} = this.state
        return (
           
            <Grid style={{background: '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{padding: '1.2em',margin:0}}>
                    <Header inverted floated="left" as="h3">
                    <Icon name="code"/>
                        <Header.Content>codeHub Chat</Header.Content>
                    </Header>
                    </Grid.Row>

                    <Header style={{padding:'0.25em'}} as="h4" inverted>
                    <Dropdown trigger={
                        <span>
                        <Image src={user.photoURL} spaced="right" avatar/>
                        {user.displayName}
                        </span>
                    }options={this.dropDownOptions()}/>
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

const maspStateToProps =state =>({
    currentUser: state.user.currentUser
})

export default connect(maspStateToProps) (UserPanel)
