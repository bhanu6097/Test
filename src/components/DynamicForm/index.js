import React from "react";
import ReactDOM from "react-dom";
import "./form.css";

export default class DynamicForm extends React.Component {
  state = {};
  constructor(props) {
    super(props);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.defaultValues &&
      Object.keys(nextProps.defaultValues).length
    ) {
      return {
        ...nextProps.defaultValues
      };
    } else {
      let initialState = nextProps.model.reduce((acc, m) => {
        acc[m.key] = m.value ? m.value : "";
        return acc;
      }, {});
      console.log("initialState: ", initialState);
      return {
        ...initialState
      };
    }
  }

  onSubmit = e => {
    e.preventDefault();
    if (this.props.onSubmit) this.props.onSubmit(this.state);
  };

  onChange = (e, key, type = "single") => {
    console.log(`${key} changed ${e.target.value} type ${type}`);
    if (type === "single") {
      this.setState({
        [key]: e.target.value
      });
    } else {
      // Array of values (e.g. checkbox): TODO: Optimization needed.
      let found = this.state[key]
        ? this.state[key].find(d => d === e.target.value)
        : false;

      if (found) {
        let data = this.state[key].filter(d => {
          return d !== found;
        });
        this.setState({
          [key]: data
        });
      } else {
        this.setState({
          [key]: [e.target.value, ...this.state[key]]
        });
      }
    }
  };

  renderForm = () => {
    let model = this.props.model;
    let defaultValues = this.props.defaultValues;

    let formUI = model.map(m => {
      let label = m.label;
      let type = m.type || "text";
      let props = m.props || {};
      let isOptional = m.isOptional;
      let value = m.value;
      console.log("Printing Values ::" + value);

      let target = label;
      value = this.state[target];

      let input = (
        <input
          {...props}
          className="form-input"
          type={type}
          label={label}
          value={value}
          onChange={e => {
            this.onChange(e, target);
          }}
        />
      );

      if (type == "radio") {
        input = m.value.map(o => {
          let checked = o;
          console.log("Printing o value::" + checked);
          return (
            <React.Fragment>
              <input
                {...props}
                className="form-input"
                type={type}
                name={checked}
                checked={checked}
                value={checked}
                onChange={e => {
                  this.onChange(e, o.name);
                }}
              />
              <label key={"ll" + o.key}>{o.label}</label>
            </React.Fragment>
          );
        });
        input = <div className="form-group-radio">{input}</div>;
      }

      if (type == "select") {
        input = m.value.map(o => {
          let checked = o.value == value;
          console.log("select: ", o.value, value);
          return (
            <option
              {...props}
              className="form-input"
              key={o.key}
              value={o.value}
            >
              {o.value}
            </option>
          );
        });

        console.log("Select default: ", value);
        input = (
          <select
            value={value}
            onChange={e => {
              this.onChange(e, m.key);
            }}
          >
            {input}
          </select>
        );
      }

      return (
        <div className="form-group">
          <label className="form-label">{m.label}</label>
          {input}
        </div>
      );
    });
    return formUI;
  };

  render() {
    let title = this.props.title || "Dynamic Form";

    return (
      <div className={this.props.className}>
        <h3 className="form-title">{title}</h3>
        <form
          className="dynamic-form"
          onSubmit={e => {
            this.onSubmit(e);
          }}
        >
          {this.renderForm()}
          <div className="form-actions">
            <button type="submit">submit</button>
          </div>
        </form>
      </div>
    );
  }
}
