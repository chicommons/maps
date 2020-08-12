import React from "react";

class Province extends React.Component {
  render() {
    let provinces = this.props.options;
    let optionItems = provinces.map((province) => (
      <option key={province.code} value={province.code}>
        {province.name}
      </option>
    ));

    return (
      <div className="form-group">
        <label htmlFor={this.props.name}> {this.props.title} </label>
        <select
          id={this.props.name}
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.handleChange}
          className="form-control"
        >
          <option value="" disabled>
            {this.props.placseholder}
          </option>
          {optionItems}
        </select>
      </div>
    );
  }
}

export default Province;
