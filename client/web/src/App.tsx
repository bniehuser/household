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
          <Login loginStatus={this.state.loggedIn} loggedIn={(loggedIn: boolean) => this.setState({loggedIn})}/>
          {this.state.loggedIn && (
              <Member>
                  {({data}: {data:any}) => (
                      <div><p>hey, looks like you're {data.member.alias}, from the {data.member.memberships[0].householdName} household.  Good to see you!</p>
                          Your other household members are
                          <ul>
                          {data.member.memberships[0].household.memberships.map((d: any) => (<li key={d.memberName}>{d.memberName}</li>))}
                          </ul>
                      </div>
                  )}
              </Member>
          )}
      </Section>
        </ApolloProvider>
    );
  }
}

export default App;
