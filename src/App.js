import React, { Component } from "react";
import DynamicForm from "./components/DynamicForm";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = {
    current: {},
    model: []
  };
  componentDidMount() {
    axios
      .get("https://ansible-template-engine.herokuapp.com/form")
      .then(results => {
        console.log(results.data);
        let result = results.data.map((e, i) => {
          return e;
        });
        this.setState({ model: result });
        console.log("I am Bhanu::" + this.state.model);
      })
      .catch(error => {
        console.log("Bhanu::" + error);
      });
  }
  onSubmit = model => {
    let data = [];
    if (model.id) {
    } else {
      model.id = +new Date();
    }
  };

  render() {
    return (
      <div className="App">
        <DynamicForm
          className="form"
          title="Registration"
          defaultValues={this.state.model.default}
          model={this.state.model}
          onSubmit={model => {
            this.onSubmit(model);
          }}
        />
      </div>
    );
  }
}

export default App;
