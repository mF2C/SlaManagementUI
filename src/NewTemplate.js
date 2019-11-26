import React, { Component } from "react";

const cimi = require('./cimi')

var api = cimi.CimiAPI("/api");

class NewTemplate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: "",
      type: "",       // danger | success
    }
  }

  setMessage(type, message) {
      this.setState({ message: message, type: type});
  }

  render() {
    return (
      <div className="templates">
        {this.state.message != "" && 
        <div className={"alert alert-" + this.state.type} role="alert">
          {this.state.message}
        </div>
        }
        <h1>New templates</h1>
        <CreateTemplateForm alert={(m, t) => this.setMessage(m, t)}/>
      </div>
    );
  }
}

class CreateTemplateForm extends React.Component {
  constructor(props) {
    super(props);
    var state = {
      name: "",
      availability: "",
      times: [],
      currMethod: "",
      currExecTime: "",
    }
    for (let key in this.props.value) {
      if (this.props.value[key] !== undefined) {
        state[key] = this.props.value[key]
      }
    }
    this.state = state;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event) {
    let newState = Object.assign({}, this.state, { name : event.target.value });
    this.setState(newState);
  }

  handleChangeAvail(event) {
    let newState = Object.assign({}, this.state, { availability : event.target.value });
    this.setState(newState);
  }

  handleDeleteTime(event) {
    let idx = parseInt(event.target.value);
    var newTimes = this.state.times.slice();
    newTimes.splice(idx, idx+1);
    let newState = Object.assign({}, this.state, { times: newTimes});

    this.setState(newState);
  }

  handleAddTime(event) {
    let item = { 
      method: this.state.currMethod, 
      execution_time: parseInt(this.state.currExecTime) || 0,
    }
    var newTimes = this.state.times.slice();
    newTimes.push(item);
    let newState = Object.assign({}, this.state, 
      { times: newTimes, currMethod: "", currExecTime: ""});
    this.setState(newState);
  }

  handleChangeMethod(event) {
    let newState = Object.assign({}, this.state, { currMethod : event.target.value });
    this.setState(newState);
  }

  handleChangeExecTime(event) {
    let newState = Object.assign({}, this.state, { currExecTime : event.target.value });
    this.setState(newState);
  }

  async handleSubmit(event) {
    /* TODO  validation */
    let tpl = this.buildTemplate(this.state)
    console.log(JSON.stringify(tpl));
    event.preventDefault();
    
    try {
      let response = await api.post('sla-template', tpl);
      console.log(`${response}`);
      //alert(`${response.message}`);
      this.props.alert("success", response.message);
    } catch (e) {
      console.log(JSON.stringify(e));
      //alert("Error creating SLA template: " + e);
      this.props.alert("danger", e.message);
    }
  }

  buildTemplate(input) {

    var guarantees = []
    var variables = []
    if (input.availability !== "") {
      guarantees.push({ 
        name: "availability", 
        constraint: `availability > ${input.availability}`});
      variables.push({
        name: "availability",
        aggregation: {
            window: 600,
            type: "average",
        }
      })
    }
    input.times.reduce((acc, curr) => {
      acc.push({ 
        name: curr.method,
        constraint: `execution_time < ${curr.execution_time}`});
      return acc;
    }, guarantees);
    return {
      "name": input.name,
      "state": "started",
      "details":{
          "type": "template",
          "name": input.name,
          "provider": { "id": "mf2c", "name": "mF2C Platform" },
          "client": { "id": "client-id", "name": "client-name" },
          "creation": new Date().toISOString(),
          "variables": variables,
          "guarantees": guarantees,
      }
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Template name (*)</label>
          <div>
            <input type="text" id="name" value={this.state.name} 
                onChange={(e) => this.handleChangeName(e) }
                className="form-control"
                aria-describedby="nameHelp" placeholder="template1"/>
            <small id="nameHelp" className="form-text text-muted">
              We recommend to prefix it with the name of the service
            </small>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="availability">Availability</label>
          <div>
            <input type="text" id="availability" value={this.state.availability} 
                onChange={(e) => this.handleChangeAvail(e)}
                className="form-control" aria-describedby="availabilityHelp" placeholder="99.9"/>
            <small id="availabilityHelp" className="form-text text-muted">
              Availability of the containers running a service instance (%)
            </small>
          </div>
        </div>

        <div className="form-group">
          <div className="row">
            <div className="col col-sm-5">
              <label htmlFor="method">Operation name</label>
            </div>
            <div className="col col-sm-5">
              <label htmlFor="execTime">Execution time</label>
            </div>
            <div className="col col-sm-2">
            </div>
          </div>
          <div className="row">
            <div className="col col-sm-5">
              <input type="text" id="method" value={this.state.currMethod}
                onChange={(e) => this.handleChangeMethod(e) }
                className="form-control" placeholder="com.example.Main.operation" aria-describedby="methodHelp" />
              <small id="methodHelp" className="form-text text-muted">
                Operation name to evaluate execution time
              </small>

            </div>
            <div className="col col-sm-5">
              <input type="text" id="execTime" value={this.state.currExecTime}
                onChange={(e) => this.handleChangeExecTime(e) }
                className="form-control" placeholder="500" aria-describedby="execTimeHelp" />
              <small id="execTimeHelp" className="form-text text-muted">
                Maximum execution time (ms)
              </small>
            </div>
            <div className="col col-sm-2">
              <button type="button" value={this.props.idx} 
                onClick={ (e) => this.handleAddTime(e) }
                className="btn btn-secondary btn-block">Add</button>
            </div>
          </div>
        </div>
        {this.state.times.map( (item, idx) => (
        <TimesLine key={"times-" + idx} idx={idx} value={item} mode="delete"
          onClick={(e) => this.handleDeleteTime(e)} />
        ))}

        <input type="submit" className="btn btn-primary"value="Submit"/>
      </form>
    );
  }
}

class TimesLine extends React.Component {

  render() {
    return (
      <div className="form-group">
        <div className="row">
          <div className="col col-sm-5">
            <input type="text" value={this.props.value.method}
              className="form-control" readOnly/>
          </div>
          <div className="col col-sm-5">
            <input type="text" value={this.props.value.execution_time}
              className="form-control" readOnly/>
          </div>
          <div className="col col-sm-2">
            <button type="button" value={this.props.idx} 
              onClick={ (e) => this.props.onClick(e) }
              className="btn btn-secondary btn-block">Delete</button>
          </div>
        </div>
      </div>
    );
  }
}

export default NewTemplate;