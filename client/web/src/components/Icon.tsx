import React from 'react'
import { library} from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, Props } from '@fortawesome/react-fontawesome'
import { faIgloo, faHome, faHandRock, faSearch } from '@fortawesome/free-solid-svg-icons'

library.add(faIgloo, faHome, faHandRock, faSearch);

export default (props: Props) => {
    return (
            <FontAwesomeIcon {...props} />
    )
};