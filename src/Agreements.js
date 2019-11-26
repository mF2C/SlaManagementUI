import React, { Component } from "react";

const cimi = require('./cimi')

var api = cimi.CimiAPI("/api");

var EMPTY_AGREEMENT = {
  id: "DEFAULT",
  details: {
    name: "",
    client: {
      name: "",
    },
    provider: {
      name: "",
    },
    guarantees: []
  }
}

class Agreements extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { 
      instances: [], 
      agreements: [],
      agreement: EMPTY_AGREEMENT,
      violations: [], 
      instancesMap: {},
      agreementsMap: {}
    }
  }

  async componentDidMount() {
    var r = await getServiceInstances()
    var a = await getAgreements()
    var nViolations = await this.buildNViolations(r.serviceInstances)
    console.log(r)
    this.setState( (state, props) => {
      return { 
        instances : r.serviceInstances,
        agreements : r.agreements,
        agreement: EMPTY_AGREEMENT,
        violations: [],
        nViolations: nViolations,
        instancesMap: this.buildInstancesMap(r.serviceInstances),
        agreementsMap: this.buildAgreementsMap(a.agreements)
      }
    })
  }

  buildInstancesMap(instances) {
    return instances.reduce( (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  buildAgreementsMap(agreements) {
    var d = {}
    d[EMPTY_AGREEMENT.id] = EMPTY_AGREEMENT;
    return agreements.reduce ( (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, d);
  }

  async buildNViolations(serviceInstances) {
    var d = {};
    for (var i = 0; i < serviceInstances.length; i++) {
      var si = serviceInstances[i];
      var vs = await getViolations(si);
      d[si.id] = vs.length;
    }
    return d;
  }

  render() {
    return (
      <div className="agreements">
        <h1>Agreements</h1>

        <div>
          <ServiceInstancesTable value={this.state} onClick={(e) => this.handleClick(e)} />
        </div>
        <div>
          <AgreementInfo value={this.state.agreement} />
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
        violations: vs,
        agreement: this.getAgreement(instance.agreement)
      }
    });
  }

  getAgreement(id) {
    let a = this.state.agreementsMap[id];
    return a === undefined? EMPTY_AGREEMENT : a;
  }
}

async function getServiceInstances() {
  return api.get('service-instance')
}

async function getViolations(serviceInstance) {
  var vs = await api.violations(`$filter=(agreement_id/href="${serviceInstance.agreement}")`)    
  // Removes incorrect violations when using stub CIMI server
  vs = vs.filter( (item) => { return item.agreement_id.href === serviceInstance.agreement });
  return vs;
}

async function getAgreements() {
  return api.get('agreement')
}

class ServiceInstancesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      instances: [],
      agreements: {}
    }
  }
  render() {
    return(
      <div>
        <h2>Instances</h2>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Client</th>
              <th>Service Name</th>
              <th>Type</th>
              <th>#Violations</th>
            </tr>
          </thead>
          <tbody>
            {this.props.value.instances.map(item => (
              <tr key={item.id} className={this.isViolated(item)? 'table-danger' : ''}>
                <td>
                  <button value={item.id} onClick={ (e) => this.props.onClick(e) }
                    className="btn btn-link">
                    { item.id.split('-').pop() }
                  </button>
                </td>
                <td>{this.getAgreement(item.agreement).details.client.name}</td>
                <td>{this.getAgreement(item.agreement).details.name}</td>
                <td>{ this.getType(item) }</td>
                <td>{ this.props.value.nViolations[item.id] }</td>
              </tr>
            ))}
          </tbody>            
        </table>
      </div>
    )
  }
  getAgreement(id) {
    var a = this.props.value.agreementsMap[id];
    return a === undefined? EMPTY_AGREEMENT : a;
  }

  getType(si) {
    return si.service_type;
  }

  isViolated(item) {
    return this.props.value.nViolations[item.id] > 0;
  }
}

class AgreementInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = EMPTY_AGREEMENT 
  }

  render() {
    let a = this.props.value;
    let visible = a.id !== EMPTY_AGREEMENT.id;
    return (
      <div style={{display: visible? 'block': 'none'}}>
        <h2>Agreement</h2>
        <ul>
          <li><a href={"/api/" + a.id}>Raw content</a></li>
          <li><label>Client:</label>{a.details.client.name}</li>
          <li><label>Provider:</label>{a.details.provider.name}</li>
        </ul>
        <h3>Guarantees</h3>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Constraint</th>
              <th>Last value</th>
              <th>Last assessment</th>
            </tr>
          </thead>
          <tbody>
            {a.details.guarantees.map(item => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.constraint}</td>
                <td>{this.getLast(a, item).value}</td>
                <td>{this.getLast(a, item).datetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  getLast(a, gt) {
    try {
      let last_values = a.assessment.guarantees[gt.name].last_values
      let metric = Object.keys(last_values)[0]
      return last_values[metric]
    } catch {
      return { value:"", datetime: ""}
    }
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
        <h2>Violations</h2>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Guarantee</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {this.props.value.map(item => (
              <tr key={item.id}>
                <td>{this.formatDate(item.datetime)}</td>
                <td>{item.guarantee}</td>
                <td>{this.formatValue(item.values)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  formatDate(s) {
    return s;    
  }

  formatValue(values) {
    return JSON.stringify(values);
  }
}

export default Agreements;