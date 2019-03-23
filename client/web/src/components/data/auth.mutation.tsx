import * as React from 'react';

import gql from "graphql-tag";
import { Mutation, Query } from "react-apollo";

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
        {(requestToken, { loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) {
                console.log(error);
                return `Error! ${error.message}`;
            }

            let isLoggedIn = !!props.loginStatus;

            let email: HTMLInputElement;
            let password: HTMLInputElement;

            return (
                <>
                    {isLoggedIn ? (
                        <p>Wow, you logged in.
                            <a href={'#'} onClick={event => {
                                event.preventDefault();
                                localStorage.removeItem('token');
                                props.loggedIn(false);
                            }}>
                                log out
                            </a>
                        </p>
                    ) : (
                        <form onSubmit={event => {
                            event.preventDefault();
                            requestToken({variables:{
                                email: email.value,
                                password: password.value,
                                householdId: 1,
                            }});
                        }}>
                            <input type={'text'} ref={r => r ? email = r : null} name={'email'} placeholder={'email'}/><br/>
                            <input type={'text'} ref={r => r ? password = r : null} name={'password'} placeholder={'password'}/><br/>
                            <button type={'submit'}>go</button>
                        </form>
                    )}
                </>
            );
        }}
    </Mutation>
);