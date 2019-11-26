import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import { tsConstructorType } from '@babel/types';
import { Navbar, Nav } from 'react-bootstrap';
import {
  Route,
  HashRouter
} from "react-router-dom";

import Home from "./Home";
import Agreements from "./Agreements";
import NewTemplate from "./NewTemplate";
import Templates from "./Templates";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


class App extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <HashRouter>

          <Navbar style={{background: "#777777"}} expand="lg">
            <Navbar.Brand href="/">
              <img
                src="img/mf2c_logo_mini.png"
                width="45"
                height="25"
                className="d-inline-block align-top"
                alt="SlaManagement UI"
              />
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#new-template">New template</Nav.Link>
                <Nav.Link href="#templates">Templates</Nav.Link>
                <Nav.Link href="#agreements">Agreements</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          <div className="content">
            <Route exact path="/" component={Home}/>
            <Route path="/agreements" component={Agreements}/>
            <Route path="/templates" component={Templates}/>
            <Route path="/new-template" component={NewTemplate}/>
          </div>
        </HashRouter>

      </div>
    );
  }
}


export default App;
