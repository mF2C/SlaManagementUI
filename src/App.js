import React from 'react';
import logo from './logo.svg';
import './App.css';

const cimi = require('./cimi')


var api = cimi.CimiAPI("/cimi/api");

class ServiceInstancesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { instances: [] }
  }
  async componentDidMount() {
    var r = await this.props.fetch()
    console.log(r)
    this.setState( (state, props) => {
      return { instances : r.serviceInstances }
    })
  }
  render() {
    return(
      <div>
        <p>Instances</p>
        <table>
          {this.state.instances.map(item => (
            <tr>
              { item.id }
            </tr>
          ))}
        </table>
      </div>
    )
  }
}

class ViolationsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" }
  }
  componentDidMount() {
    this.setState( (state, props) => {
      return { text: props.fetch() };
    })
  }
  render() {
    return (
      <div>
        { this.props.location + this.state.text}
        <table>
          {this.props.value.items.map(item => (
            <tr>
              <td>{item.id}</td>
              <td>{item.datetime}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect to CIMI
        </a>
      </header>
      <div>
        <ServiceInstancesTable value={ {} } fetch={getServiceInstances} />
      </div>
      <div>
        <ViolationsTable value={{items: getViolations() }} fetch={hello}/>
      </div>
    </div>
  );
}

function getViolations() {
  return [ { id: 1, datetime: "2019-01-02" }, { id: 2, datetime: "2019-12-31"}];
}

function hello() {
  return "Hello world";
}

async function getServiceInstances() {
  return api.get('service-instance')
}

export default App;
