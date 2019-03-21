import React from 'react'
import { Icon, IconProps } from 'react-bulma-components';
import { library, SizeProp, IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo, faHome, faHandRock } from '@fortawesome/free-solid-svg-icons'

library.add(faIgloo, faHome, faHandRock);



/**
 * @see https://bulma.io/documentation/elements/icon/#sizes
 * @param {String} size
 */
const getFASize = (size: "small" | "medium" | "large" | "auto"): SizeProp => {
    switch(size) {
        case 'small':
            return '1x';
        case 'medium':
            return '2x';
        case 'large':
            return '3x';
        default:
            return 'lg';
    }
};

export default (props: IconProps) => (
    <Icon size={props.size}>
        <FontAwesomeIcon {...{...props, icon: props.icon as IconProp}} size={props.size ? getFASize(props.size) : 'lg'} />
    </Icon>
);