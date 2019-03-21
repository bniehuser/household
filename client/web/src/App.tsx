import React, { Component } from 'react';
import Logo from './components/Logo';
import './App.scss';
import { Section, Heading, Content } from 'react-bulma-components';

class App extends Component {
  render() {
    return (
      <>
      <Section>
        <Heading>
            <Logo/>
        </Heading>
      </Section>
      <Section>
          <Content>
              Edit <code>src/App.tsx</code> and save to reload.
          </Content>
          <a
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
              Learn React
          </a>
      </Section>
        </>
    );
  }
}

export default App;
