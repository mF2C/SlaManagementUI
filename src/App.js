import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import { tsConstructorType } from '@babel/types';

const cimi = require('./cimi')


var api = cimi.CimiAPI("/cimi/api");

class ServiceInstancesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { instances: [] }
  }
  render() {
    return(
      <div>
        <p>Instances</p>
        <table>
          <tbody>
            {this.props.value.map(item => (
              <tr key={item.id}>
                <td>
                  <button value={item.id} onClick={ (e) => this.props.onClick(e) }>{ item.id }</button>
                </td>
              </tr>
            ))}
          </tbody>            
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
      return { text: "" };
    })
  }
  render() {
    return (
      <div>
        <p>Violations</p>
        <table>
          <tbody>
            {this.props.value.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.datetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { instances: [], violations: [], instancesMap: {} }
  }
  async componentDidMount() {
    var r = await getServiceInstances()
    console.log(r)
    this.setState( (state, props) => {
      return { 
        instances : r.serviceInstances,
        violations: [],
        instancesMap: this.buildInstancesMap(r.serviceInstances)
      }
    })
  }

  buildInstancesMap(instances) {
    return instances.reduce( (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  render() {
    return (
      <div className="App">
        <div>
          <ServiceInstancesTable value={this.state.instances} onClick={(e) => this.handleClick(e)} />
        </div>
        <div>
          <ViolationsTable value={this.state.violations} />
        </div>
      </div>
    );
  }

  async handleClick(e) {
    const id = e.target.value;
    const instance = this.state.instancesMap[id]
    console.log("Loading violations. si = " + id)
    var vs = await getViolations(instance);
    this.setState( (state, props) => {
      return {
        instances: state.instances,
        instancesMap: state.instancesMap,
        violations: vs
      }
    });
  }
}

function getDummyViolations(si) {
  return [ { id: si + "-1", datetime: "2019-01-02" }, { id: si + "-2", datetime: "2019-12-31"}];
}

function hello() {
  return "Hello world";
}

async function getServiceInstances() {
  return api.get('service-instance')
}

async function getViolations(serviceInstance) {
  return api.violations(`$filter=(agreement_id/href="${serviceInstance.agreement}")`)
}

export default App;
