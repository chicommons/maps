import React, {Component} from 'react';  
import {FormGroup} from 'react-bootstrap';

/* Import Components */
import Input from '../components/Input';  
import Country from '../components/Country';
import Province from '../components/Province';
import Button from '../components/Button'

class FormContainer extends Component {  
  static DEFAULT_COUNTRY = 484
  static REACT_APP_PROXY = process.env.REACT_APP_PROXY

  constructor(props) {
    super(props);

    this.state = {
      countries: [],
      provinces: [],
      errors: [],
      newCoop: {
        name: '',
        types: [{
          name: ''
        }],
        address: {
          formatted: '',
          locality: {
            name: '',
            postal_code: '',
            state: ''
          },
          country: FormContainer.DEFAULT_COUNTRY,
        },
        enabled: true,
        email: '',
        phone: '',
        web_site: '' 
      },

    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  /* This life cycle hook gets executed when the component mounts */

  async handleFormSubmit(e) {
    e.preventDefault();
    const NC = this.state.newCoop;
    delete NC.address.country;

    try {
      console.log("proxy: " + FormContainer.REACT_APP_PROXY);  
      const response = await fetch(FormContainer.REACT_APP_PROXY + '/coops/',{
        method: "POST",
        body: JSON.stringify(this.state.newCoop),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const result = await response.json();
        window.flash('Record has been created successfully!', 'success') 
        this.handleClearForm();
        return result;
      }
      throw await response.json();
    } catch (errors) {
      console.log('_error_: ', errors);
      this.setState({ errors });
    }  
  } 

  handleClearForm() {
    // Logic for resetting the form
  }

  handleInput(e) {
    let self=this
    let value = e.target.value;
    let name = e.target.name;
    //update State
    this.setValue(self.state.newCoop,name,value)
  }

  handleTypeChange(e) {
    let self=this
    let value = e.target.value;
    let name = e.target.name;
    //update State
    this.setState({
      newCoop: { ...this.state.newCoop, types: [{ name: e.target.value }] }
    });
    //this.setState({newCoop: types[0].name = value}); 
  }


  setValue = (obj,is, value) => {
       if (typeof is == 'string')
         return this.setValue(obj,is.split('.'), value);
       else if (is.length === 1 && value!==undefined) { 
         return this.setState({obj: obj[is[0]] = value});
       } else if (is.length === 0)
         return obj;
       else
         return this.setValue(obj[is[0]],is.slice(1), value);
  }

  render() {
    return (
      <div>
        <form className="container-fluid" onSubmit={this.handleFormSubmit}>
            <FormGroup
                controlId="formBasicText">      

                <Input inputType={'text'}
                   title= {'Name'} 
                   name= {'name'}
                   value={this.state.newCoop.name} 
                   placeholder = {'Enter cooperative name'}
                   handleChange = {this.handleInput}
                   errors = {this.state.errors} 
                   /> {/* Name of the cooperative */}
 
                <Input inputType={'text'}
                   title= {'Type'} 
                   name= {'types[0].name'}
                   value={this.state.newCoop.types[0].name} 
                   placeholder = {'Enter cooperative type'}
                   handleChange = {this.handleTypeChange}
                   errors = {this.state.errors} 
                   /> {/* Type of the cooperative */}
 
                <Input inputType={'text'}
                   title= {'Street'} 
                   name= {'address.formatted'}
                   value={this.state.newCoop.address.formatted} 
                   placeholder = {'Enter address street'}
                   handleChange = {this.handleInput}
                   errors = {this.state.errors} 
                  /> {/* Address street of the cooperative */}
 
                <Input inputType={'text'}
                   title= {'City'} 
                   name= {'address.locality.name'}
                   value={this.state.newCoop.address.locality.name} 
                   placeholder = {'Enter address city'}
                   handleChange = {this.handleInput}
                   errors = {this.state.errors} 
                   /> {/* Address city of the cooperative */}
        
              <Country title={'Country'}
                  name={'address.country'}
                  options = {this.state.countries} 
                  value = {this.state.newCoop.address.country}
                  placeholder = {'Select Country'}
                  handleChange = {this.handleInput}
                  /> {/* Country Selection */}

              <Province title={'State'}
                  name={'address.locality.state'}
                  options = {this.state.provinces} 
                  value = {this.state.newCoop.address.locality.state}
                  placeholder = {'Select State'}
                  handleChange = {this.handleInput}
                  /> {/* State Selection */}

              <Input inputType={'text'}
                   title= {'Postal Code'} 
                   name= {'address.locality.postal_code'}
                   value={this.state.newCoop.address.locality.postal_code} 
                   placeholder = {'Enter postal code'}
                   handleChange = {this.handleInput}
                   errors = {this.state.errors} 
                   /> {/* Address postal code of the cooperative */}
 
              <Input inputType={'text'}
                   title= {'Email'} 
                   name= {'email'}
                   value={this.state.newCoop.email} 
                   placeholder = {'Enter email'}
                   handleChange = {this.handleInput}
                   errors = {this.state.errors}
                   /> {/* Email of the cooperative */}
 
              <Input inputType={'text'}
                   title= {'Phone'} 
                   name= {'phone'}
                   value={this.state.newCoop.phone} 
                   placeholder = {'Enter phone number'}
                   handleChange = {this.handleInput}
                   errors = {this.state.errors} 
                   /> {/* Phone number of the cooperative */}

              <Input inputType={'text'}
                   title= {'Web Site'} 
                   name= {'web_site'}
                   value={this.state.newCoop.web_site} 
                   placeholder = {'Enter web site'}
                   handleChange = {this.handleInput}
                   errors = {this.state.errors} 
                   /> {/* Web site of the cooperative */}


              <Button 
                  action = {this.handleFormSubmit}
                  type = {'primary'} 
                  title = {'Submit'} 
                  style={buttonStyle}
              /> { /*Submit */ }
          
              <Button 
                  action = {this.handleClearForm}
                  type = {'secondary'}
                  title = {'Clear'}
                  style={buttonStyle}
              /> {/* Clear the form */}

            </FormGroup>
        </form>
      </div>
    );
  }

  componentDidMount() {
    let initialCountries = [];
    let initialProvinces = [];
    // Get initial countries 
    fetch(FormContainer.REACT_APP_PROXY + '/countries/')
        .then(response => {
            return response.json();
        }).then(data => {
        initialCountries = data.map((country) => {
            return country
        });
        this.setState({
            countries: initialCountries,
        });
    });
    // Get initial provinces (states) 
    fetch(FormContainer.REACT_APP_PROXY + '/states/' + FormContainer.DEFAULT_COUNTRY)
        .then(response => {
            return response.json();
        }).then(data => {
        initialProvinces = data.map((province) => {
            return province
        });
        this.setState({
            provinces: initialProvinces,
        });
    });
  }
}

const buttonStyle = {
  margin : '10px 10px 10px 10px'
}

export default FormContainer;


