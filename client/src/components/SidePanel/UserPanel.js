import React, { Component } from 'react'
import {Grid,Header,Icon, Dropdown,Image, Modal, Input, Button} from 'semantic-ui-react'
import {connect} from 'react-redux'
import firebase from '../../firebase'

export class UserPanel extends Component {
    state={
        user:this.props.currentUser,
        modal: false
    

    }

    componentWillReceiveProps(nextProps){
        this.setState({user: nextProps.currentUser})
    }

    openModal = ()=>this.setState({modal:true})

    closeModal = ()=>this.setState({modal:false})

    dropDownOptions = ()=>[{
        key:'user',
        text:<span>Singed in as <strong>{this.state.user.displayName}</strong></span>,
        disabled:true
    },
    {
        key:'avatar',
        text: <span onClick={this.openModal}>Change Avatar</span>
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
        const {user,modal} = this.state
        const {primaryColor} = this.props
        return (
           
            <Grid style={{background: primaryColor}}>
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

                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                        <Input fluid type="file" label="New Avatar" name="previewImage"/>
                        <Grid centered stackable columns={2}>
                        <Grid.Row centered>
                        <Grid.Column className="ui center aligned grid">
                        
                        
                        </Grid.Column>
                        <Grid.Column>
                        
                        
                        </Grid.Column>
                        </Grid.Row>
                        
                        </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="green" inverted>
                            <Icon name="save"/>Change Avatar
                            </Button>
                            <Button color="green" inverted>
                            <Icon name="image"/>Preview
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove"/>Cancel
                            </Button>
                        
                        </Modal.Actions>
                </Modal>
            </Grid>
        )
    }
}

const maspStateToProps =state =>({
    currentUser: state.user.currentUser
})

export default connect(maspStateToProps) (UserPanel)
