import React, { Component } from "react";

const cimi = require('./cimi')

var api = cimi.CimiAPI("/api");

async function getTemplates() {
  return api.get('sla-template')
}

let EMPTY_TEMPLATE = {
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

class Templates extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      templates: [],
      template: EMPTY_TEMPLATE,
    }
  }

  async componentDidMount() {
    console.log("pre getTemplates");
    var r = await getTemplates()
    console.log(JSON.stringify(r));
    this.setState( (state, props) => {
      return { 
        templates : r.templates,
        templatesMap: this.buildMap(r.templates),
      }
    })
  }
 
  buildMap(items) {
    return items.reduce( (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }  

  render() {
    return (
    <div className="agreements">
      <h1>Templates</h1>

      <div>
      <TemplatesTable value={this.state} onClick={(e) => this.handleClick(e)} />
      </div>
      <div>
      <TemplateInfo value={this.state.template} />
      </div>
    </div>
    );
  }

  async handleClick(e) {
    const id = e.target.value;
    const template = this.state.templatesMap[id]
    this.setState( (state, props) => {
      return {
          templates: state.templates,
          templatesMap: state.templatesMap,
          template: template,
      }
    });
  }  
}
 
class TemplatesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
    }
  }

  render() {
    return(
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {this.props.value.templates.map(item => (
              <tr key={item.id}>
                <td>
                  <button value={item.id} onClick={ (e) => this.props.onClick(e) }
                    className="btn btn-link">
                    { item.id.split('-').pop() }
                  </button>
                </td>
                <td>{item.details.name}</td>
              </tr>
            ))}
          </tbody>            
        </table>
      </div>
    )
  }
}

class TemplateInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let t = this.props.value;
    let rows = (t.id !== EMPTY_TEMPLATE.id)? this.buildRows(t): [];
    return (
      <div>
        {rows.length > 0 && <h2>Template</h2>}
        <table className="table table-hover">
          <tbody>
            {rows.map( (item, idx) => (
            <tr key={"row" + idx}>
              <th scope="row">{item.key}</th>
              {
                item.key === "ID" && 
                <td><a href={"/api/" + item.value}>{item.value}</a></td> ||
                <td>{item.value}</td>
              }
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  buildRows(t) {
    var result = [];
    result.push({ key: "ID", value: t.id});
    result.push({ key: "Name", value: t.name});
    t.details.guarantees.map( item => {
      result.push({ key: this.getGuaranteeLabel(item), value: item.constraint});
    });
    return result;
  }

  getGuaranteeLabel(gt) {
    if (gt.name == "availability") {
      return gt.name
    }
    return `ExecTime(${gt.name})`;
  }
}


export default Templates;