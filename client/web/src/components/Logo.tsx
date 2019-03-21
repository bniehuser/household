import { Component } from 'react';
import React from 'react';
import Icon from './Icon';
import { Content } from 'bloomer';

export default class Logo extends Component {
    render() {
        return (
            <div className="html-logo">
                <div className="blue" style={{textAlign:'right',flex:1}}>
                    <Icon icon="home"/><br/>
                    <Content>house</Content>
                </div>
                <div className="orange" style={{textAlign:'left',flex:1}}>
                    <Icon icon="hand-rock"/><br/>
                    <Content>hold</Content>
                </div>
            </div>
        );
    }
}
