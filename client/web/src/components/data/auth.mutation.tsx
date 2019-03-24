import * as React from 'react';

import gql from "graphql-tag";
import { Mutation, Query } from "react-apollo";
import { Button, Control, Field, Help, Icon, Input, Label, Section, Tile } from 'bloomer';

const MEMBER = gql`
  mutation requestToken($email: String!, $password: String!, $householdId: Float) {
    requestToken(email: $email, password: $password, householdId: $householdId) {
      token
    }
  }
`;

export default (props: any) => (
    <Mutation mutation={MEMBER}
        onCompleted={(data: any) => {
            console.log('completed data was', data);
            if(data && data.requestToken && data.requestToken.token) {
                console.log('setting token', data.requestToken.token);
                localStorage.setItem('token', data.requestToken.token);
                props.loggedIn(true);
            }
        }}
    >
        {(requestToken, { client, loading, error }) => {
            if (loading) return "Loading...";
            let isError = false;
            let errorMessage = '';
            if (error) {
                console.log(error);
                isError = true;
                errorMessage = error.message;
            }

            let isLoggedIn = !!props.loginStatus;

            let email: HTMLElement;
            let password: HTMLElement;

            return isLoggedIn ? (
                <Section>
                    Hey, you're logged in!{' '}
                    <a href={'#'} onClick={event => {
                        event.preventDefault();
                        localStorage.removeItem('token');
                        props.loggedIn(false);
                        client.resetStore();
                    }}>
                        log out
                    </a>
                </Section>
            ) : (
                <Tile isAncestor={true}>
                <Tile isSize={6}>
                    <Tile isChild={true} render={() => (
                        <form onSubmit={event => {
                            event.preventDefault();
                            console.log('email, password', email, password);
                            requestToken({variables:{
                                email: (email as HTMLInputElement).value,
                                password: (password as HTMLInputElement).value,
                                householdId: 1,
                            }});
                        }}>


                            <Field>
                                <Label>Email</Label>
                                <Control hasIcons={'left'}>
                                    <Input type={'email'} onChange={e => console.log(e) }  ref={r => r ? email = r : null} name={'email'} placeholder={'email'}/><br/>
                                    <Icon isAlign={'left'} className={'fas fa-user'}/>
                                </Control>
                            </Field>
                            <Field>
                                <Label>Password</Label>
                                <Control>
                                    <Input type={'password'} ref={r => r ? password = r : null} name={'password'} placeholder={'password'}/><br/>
                                </Control>
                            </Field>
                            <Field isGrouped={true}>
                                <Control>
                                    <Button isColor={'primary'} type={'submit'}>go</Button>
                                </Control>
                                {isError && <Help isColor={'error'}>{errorMessage}</Help>}
                            </Field>
                        </form>
                    )}/>
                </Tile>
                </Tile>
            );
        }}
    </Mutation>
);