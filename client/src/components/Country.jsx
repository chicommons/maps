import React from 'react';

class Country extends React.Component {
    constructor() {
        super();
    }

    render () {
        let countries = this.props.options;
        let optionItems = countries.map((country) =>
                <option value={country.id}>{country.name}</option>
            );

        return (
          <div className="form-group">
			<label for={this.props.name}> {this.props.title} </label>
	    <select
		      id = {this.props.name}
		      name={this.props.name}
		      value={this.props.value}
		      onChange={this.props.handleChange}
		      className="form-control">
		      <option value="" disabled>{this.props.placeholder}</option>
		      {optionItems}
            </select>
          </div>
        )
    }
}

export default Country;

