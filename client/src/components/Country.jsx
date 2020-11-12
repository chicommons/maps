import React from "react";

class Country extends React.Component {
  render() {
    let countries = this.props.options;
    let optionItems = countries.map((country) => (
      <option key={country.code} value={country.code}>
        {country.name}
      </option>
    ));
    const country = countries.find(
      (country) => country.code === this.props.countryCode
    );

    return (
      <div className="form-group">
        <label className={this.props.className} htmlFor={this.props.name} style={inputStyle}> {this.props.title} </label>
        <select
          id={this.props.name}
          name={this.props.name}
          value={country?.code}
          onChange={this.props.handleChange}
          className="form-control"
        >
          <option value="" disabled>
            {this.props.placeholder}
          </option>
          {optionItems}
        </select>
      </div>
    );
  }
}
const inputStyle = {
  color: "#124E54"
  }

export default Country;
