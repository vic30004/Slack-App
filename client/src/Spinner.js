import React from 'react'
import {Loader, Dimmer} from 'semantic-ui-react'

const Spinner = () => {
    return (
        <Dimmer active>
<Loader size="huge" content={"One moment please, I am writing the code for this app..."}/>
</Dimmer>
    )
}

export default Spinner
