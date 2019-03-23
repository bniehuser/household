import React, { Component } from 'react';
import './App.scss';
import {
    Section,
    Content,
} from 'bloomer';
import Nav from "./components/Nav";
import { ApolloProvider } from "react-apollo";

import client from './api/client';
import Login from './components/data/auth.mutation';
import Member from './components/data/member';

interface IProps {}
interface IState {
    loggedIn: boolean;
}

class App extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { loggedIn: !!localStorage.getItem('token') }
    }

  render() {
    return (
        <ApolloProvider client={client}>
          <Nav/>
      <Section>
          <Login loggedIn={(loggedIn: boolean) => this.setState({loggedIn})}/>
          {this.state.loggedIn && (
              <Member>
                  {({data}: {data:any}) => {
                      return <p>hey, looks like you're {data.alias}.  Good to see you!</p>;
                  }}
              </Member>
          )}
          <Content>
              should be <code>edited</code> now.
          </Content>
          <a
              href="http://localhost:4000/graphql"
              target="_blank"
              rel="noopener noreferrer"
          >
              playground
          </a>
      </Section>
        </ApolloProvider>
    );
  }
}

export default App;
