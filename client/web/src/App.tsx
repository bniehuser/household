import React, { Component } from 'react';
import Logo from './components/Logo';
import './App.scss';
import {
    Section,
    Content,
    Navbar,
    NavbarBrand,
    NavbarItem,
    NavbarMenu,
    NavbarStart,
    NavbarEnd,
    Field,
    Control, Input, Icon
} from 'bloomer';
import FAIcon from "./components/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Nav from "./components/Nav";

class App extends Component {
  render() {
    return (
      <>
          <Nav/>
      <Section>
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
        </>
    );
  }
}

export default App;
