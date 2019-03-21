import { Component } from 'react';
import React from 'react';
import Icon from './Icon';
import { Content } from 'react-bulma-components';

export default class Logo extends Component {
    render() {
        return (
            <div style={{display:'flex',flexDirection:'row'}} className="html-logo">
                <div className="blue" style={{textAlign:'right',flex:1}}>
                    <Icon icon="home" size={'auto'}/><br/>
                    <Content>house</Content>
                </div>
                <div className="orange" style={{textAlign:'left',flex:1}}>
                    <Icon icon="hand-rock" size={'auto'}/><br/>
                    <Content>hold</Content>
                </div>
            </div>
        );
    }
}
