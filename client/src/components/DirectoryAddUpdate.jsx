import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { FormGroup } from 'react-bootstrap';
import CoopService from '../services/CoopService';
import Input from '../components/Input';
import DropDownInput from '../components/DropDownInput';
import TextAreaInput from '../components/TextAreaInput';

import { DEFAULT_COUNTRY_CODE, DEFAULT_FORM_YES_NO } from '../utils/constants';
import { useAlert } from '../components/AlertProvider';
import Button from '../components/Button';
import '../containers/FormContainer.css';
import CancelButton from './CancelButton';
import AddressInputGroup from './AddressInputGroup';
import ContactMethodInput from './ContactMethodInput';
import ContactPersonInput from './ContactPersonInput';

const { REACT_APP_PROXY } = process.env;

export default function DirectoryAddUpdate() {
  /**
   * @typedef {object} Address
   * @property {string} street_address - the street address of the entity
   * @property {string} city - the city of the entity
   * @property {string} state - the state of the entity
   * @property {string} postal_code - the postal code of the entity
   * @property {string} country - the country of the entity
   * @property {string} county - the county of the entity
   */

  /**
   * @typedef {object} AddressObj 
   * @property {Address} address - the address of the entity
   * @property {number} id - the id of the address
   * @property {boolean} is_public - whether the address is public
   * /
 
  /**
   * @typedef {object} ContactObject 
   * @property {string} email - the email of the entity
   * @property {string} phone - the phone number of the entity
   * @property {boolean} is_public - whether the contact information is public
   * @property  type - the type of contact information
   * @property {('EMAIL'|'PHONE')} type - the type of contact information
   * @property {number} id - the id of the contact information
   */

  /**
   * @typedef {object} Person
   * @property {string} first_name - the first name of a person
   * @property {string} last_name - the last name of a person
   * @property {boolean} is_public - whether the person's information is public
   * @property {Array<ContactObject>} contact_methods - the contact methods for the team member
   * @property {number} id - the id of the person
   */

  const [coopObj, setCoopObj] = useState({});
  const [coopName, setCoopName] = useState('');
  const [street, setStreet] = useState('');
  const [addressPublic, setAddressPublic] = useState(DEFAULT_FORM_YES_NO);
  const [city, setCity] = useState('');
  const [state, setState] = useState('IL');
  const [zip, setZip] = useState('');
  const [county, setCounty] = useState('');
  const [country, setCountry] = useState(DEFAULT_COUNTRY_CODE);
  const [websites, setWebsites] = useState('');

  /**
   * @type {ReturnType<typeof useState<Array<Person>>}
   */
  const [contactPerson, setContactPerson] = useState([
    {
      first_name: '',
      last_name: '',
      is_public: 'yes',
      contact_methods: [
        {
          phone: null,
          email: null,
          is_public: 'yes',
          type: 'PHONE',
        },
      ],
    },
  ]);

  /**
   * @type {ReturnType<typeof useState<Array<ContactObject>>}
   */
  const [contactMethods, setContactMethods] = useState([
    { phone: null, email: null, is_public: 'yes', type: 'PHONE' },
  ]);

  const [contactEmail, setContactEmail] = useState([]);
  const [contactPhone, setContactPhone] = useState('');
  const [entityTypes, setEntityTypes] = useState([]);
  const [scope, setScope] = useState('Local');
  const [tags, setTags] = useState('');
  const [descEng, setDescEng] = useState('');
  const [descOther, setDescOther] = useState('');
  const [reqReason, setReqReason] = useState('Add new record');

  // Holds country and state list
  const [countries, setCountries] = React.useState([]);
  const [provinces, setProvinces] = React.useState([]);
  const [entities, setEntityTypeList] = React.useState([]);

  // Validation
  const [errors, setErrors, getErrors] = React.useState();

  // Errors when loading already existing entity
  const [loadErrors, setLoadErrors] = React.useState('');

  // While loading coop data from ID
  const [loadingCoopData, setLoadingCoopData] = React.useState(false);

  // Alert provider state
  const [open] = useAlert();

  // Gets id from URL
  const { id } = useParams();

  // State for Coop Approve page
  const [approvalForm, setApprovalForm] = React.useState(false);

  const clearForm = () => {
    // Resets the initial form values to clear the form
    setCoopName('');
    setStreet('');
    setAddressPublic(DEFAULT_FORM_YES_NO);
    setCity('');
    setState('IL');
    setZip('');
    setCounty('');
    setCountry(DEFAULT_COUNTRY_CODE);
    setWebsites('');
    setContactPerson([]);
    setEntityTypes([]);
    setScope('Local');
    setTags('');
    setDescEng('');
    setDescOther('');
    setErrors();
  };

  const oldValues = {};

  function convertProposedChanges() {
    if (coopObj.proposed_changes.name !== coopName) {
      oldValues.coop_name = coopName;
      setCoopName(coopObj.proposed_changes.name);
    }
    if (coopObj.proposed_changes.email.email !== contactEmail) {
      oldValues.contact_email = contactEmail;
      setContactEmail(coopObj.proposed_changes.email.email);
    }
    if (coopObj.proposed_changes.phone.phone !== contactPhone) {
      oldValues.contact_phone = contactPhone;
      setContactPhone(coopObj.proposed_changes.phone.phone);
    }
    if (coopObj.proposed_changes.types !== entityTypes) {
      oldValues.entity_types = entityTypes;
      setEntityTypes(coopObj.proposed_changes.types.map((item) => item.name));
    }

    // Should this be set up for multiple sites?
    if (coopObj.proposed_changes.web_site !== websites) {
      oldValues.websites = websites;
      setWebsites(coopObj.proposed_changes.web_site);
    }

    if (
      coopObj.proposed_changes.addresses[0].address.street_address !== street
    ) {
      oldValues.street = street;
      setStreet(coopObj.proposed_changes.addresses[0].address.street_address);
    }
    if (coopObj.proposed_changes.addresses[0].address.city !== city) {
      oldValues.city = city;
      setCity(coopObj.proposed_changes.addresses[0].address.city);
    }
    if (
      coopObj.proposed_changes.addresses[0].address.locality.state.code !==
      state
    ) {
      oldValues.state = state;
      setState(
        coopObj.proposed_changes.addresses[0].address.locality.state.code
      );
    }
    if (
      coopObj.proposed_changes.addresses[0].address.locality.postal_code !== zip
    ) {
      oldValues.zip = zip;
      setZip(
        coopObj.proposed_changes.addresses[0].address.locality.postal_code
      );
    }
    if (coopObj.proposed_changes.addresses[0].is_public !== addressPublic) {
      oldValues.address_public = addressPublic;
      setAddressPublic(coopObj.proposed_changes.addresses[0].is_public);
    }
    if (coopObj.proposed_changes.description !== descEng) {
      oldValues.description = descEng;
      setDescEng(coopObj.proposed_changes.description);
    }
  }

  function checkExistingEntity() {
    if (coopObj.proposed_changes) {
      convertProposedChanges();
    }

    let formElements = document.querySelectorAll('.form-control');

    formElements.forEach((input) => {
      if (oldValues.hasOwnProperty(input.name)) {
        input.classList.add('new-data');
        let newText = document.createElement('span');
        newText.classList.add('old-data');
        newText.innerHTML = `${
          oldValues[input.name] ? oldValues[input.name] : 'Not filled'
        }`;
        input.parentNode.insertBefore(newText, input.nextSibling);
      }
    });
  }

  // Check required fields to see if they're still blank
  const requiredFields = [
    coopName,
    street,
    city,
    county,
    websites,
    contactEmail,
    contactPhone,
    entityTypes,
  ];

  const updateRequired = (field) => {
    const asArray = Object.entries(errors?.coop);

    let filteredItem = '';

    switch (field) {
      case coopName:
        filteredItem = 'coop_name';
        break;
      case county:
        filteredItem = 'county';
        break;
      case websites:
        filteredItem = 'websites';
        break;
      case contactEmail:
        filteredItem = 'contact';
        break;
      case contactPhone:
        filteredItem = 'contact';
        break;
      case entityTypes:
        filteredItem = 'entity_types';
        break;
      default:
        break;
    }

    if (errors?.coop?.hasOwnProperty(filteredItem)) {
      setErrors(
        Object.fromEntries(
          asArray.filter(([key, value]) => key !== filteredItem)
        )
      );
    }
  };

  const checkRequired = () => {
    if (!errors) {
      return;
    } else {
      requiredFields.forEach((field) => {
        if (field.length !== 0) {
          updateRequired(field);
        }
      });
    }
  };

  // Router history for bringing user to search page on submit
  const history = useHistory();

  const fetchCoopForUpdate = async () => {
    setLoadingCoopData(true);

    try {
      const res = await fetch(REACT_APP_PROXY + `/api/v1/coops/${id}/`);
      if (!res.ok) {
        throw Error('Cannot access requested entity.');
      }
      const coopResults = await res.json();

      setCoopName(coopResults.name ? coopResults.name : '');
      setStreet(
        coopResults.addresses[0].address.street_address
          ? coopResults.addresses[0].address.street_address
          : ''
      );
      setCity(
        coopResults.addresses[0].address.city
          ? coopResults.addresses[0].address.city
          : ''
      );
      setState(
        coopResults.addresses[0].address.state
          ? coopResults.addresses[0].address.state
          : ''
      );
      setZip(
        coopResults.addresses[0].address.postal_code
          ? coopResults.addresses[0].address.postal_code
          : ''
      );
      setCountry(
        coopResults.addresses[0].address.country
          ? coopResults.addresses[0].address.country
          : ''
      );
      setWebsites(coopResults.web_site ? coopResults.web_site : '');
      setContactEmail(coopResults.email ? coopResults.email : []);
      setContactPhone(coopResults.phone ? coopResults.phone : []);
      coopResults.people.length > 0 && setContactPerson(coopResults.people);
      setContactMethods(
        coopResults.contact_methods.length > 0
          ? coopResults.contact_methods
          : [{ phone: null, email: null, is_public: 'yes', type: 'PHONE' }]
      );
      setEntityTypes(
        [coopResults.types[0]] ? coopResults.types.map((type) => type.name) : []
      );
      setDescEng(coopResults.description ? coopResults.description : '');
      setReqReason('Update existing record');
      setCoopObj(coopResults);
    } catch (error) {
      console.error(error);
      setLoadErrors(`Error: ${error.message}`);
    } finally {
      setLoadingCoopData(false);

      if (location.pathname.includes('approve')) {
        setApprovalForm(true);
      }
    }
  };

  // APPROVAL TEST
  const location = useLocation();

  const submitApprovalForm = () => {
    console.log('submitting the approval form');
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (approvalForm) {
      submitApprovalForm();
      return;
    }

    let result = entityTypes.map((type) => ({ name: type }));

    let formData = {
      coop_public_id: id,
      operation: 'UPDATE',
      coop: {
        types: result,
        contact_methods: contactMethods,
        people: contactPerson,
        addresses: [
          {
            address: {
              street_address: street,
              city: city,
              county: county,
              state: state,
              postal_code: zip,
              country: country,
            },
            is_public: addressPublic,
          },
        ],
        status: 'ACTIVE',
        name: coopName,
        web_site: websites,
        description: descEng,
        is_public: true,
        scope: scope,
        tags: tags,
      },
    };

    CoopService.proposeUpdate(
      formData,
      (errors) => {
        setErrors(errors);
      },
      function () {
        clearForm();
        window.scrollTo(0, 0);

        // Alert message
        const message = `Form Submission for ${coopName} successful`;
        if (message) open(message);

        // If update request, redirects user to search page on form submit.
        if (id) {
          history.push('/search');
        }
      }
    );
  };

  useEffect(() => {
    // Get initial countries
    fetch(REACT_APP_PROXY + '/api/v1/countries/')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const initialCountries = data.map((country) => {
          return country;
        });
        setCountries(initialCountries);
      });

    // Get initial provinces (states)
    fetch(REACT_APP_PROXY + '/api/v1/geo/states/' + DEFAULT_COUNTRY_CODE)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const initialProvinces = data.map((province) => {
          return province;
        });
        setProvinces(initialProvinces);
      });

    //   Get initial entity types
    fetch(REACT_APP_PROXY + '/api/v1/predefined_types/')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const initialEntityTypes = data.map((entity) => {
          return entity;
        });
        setEntityTypeList(initialEntityTypes);
      });

    if (id) {
      if (location.pathname.includes('approve')) {
        setApprovalForm(true);
      }

      fetchCoopForUpdate();
    }
  }, []);

  useEffect(() => {
    if (location.pathname.includes('approve')) {
      checkExistingEntity();
    }
  }, [coopObj]);

  // Checking required field changes with useEffect.
  useEffect(() => {
    checkRequired();
  }, requiredFields);

  const handlePersonChange = (event, key) => {
    event.preventDefault();
    const { dataset, value } = event.target;
    const updatedValues = [...contactPerson];
    const selectedItem = contactPerson[dataset.index]; // select index of contactPerson state
    selectedItem[key] = value; // key of selected index
    updatedValues[dataset.index] = selectedItem;
    setContactPerson(updatedValues);
  };

  const handlePersonContactChange = (event, key) => {
    event.preventDefault();
    const { dataset, value } = event.target;
    const updatedValues = [...contactPerson];
    const selectedItem =
      contactPerson[dataset.parent]['contact_methods'][dataset.index];
    selectedItem[key] = value;
    updatedValues[dataset.parent]['contact_methods'][dataset.index] =
      selectedItem;
    setContactPerson(updatedValues);
  };

  const handleContactMethodChange = (event, key) => {
    event.preventDefault();
    const { dataset, value } = event.target;
    const updatedValues = [...contactMethods];
    const selectedItem = contactMethods[dataset.index];
    selectedItem[key] = value;
    updatedValues[dataset.index] = selectedItem;
    setContactMethods(updatedValues);
  };

  const addContactPerson = () => {
    let newContactPerson = [...contactPerson];
    let newField = {
      first_name: '',
      last_name: '',
      is_public: 'yes',
      contact_methods: [],
    };
    newContactPerson.push(newField);
    setContactPerson(newContactPerson);
  };

  const addContactMethodField = () => {
    let newContactMethodArray = [...contactMethods];
    let newField = {};
    newContactMethodArray.push(newField);
    setContactMethods(newContactMethodArray);
  };

  return (
    <div className="directory-form">
      <h1 className="form__title">
        {approvalForm ? <>Approval Form</> : <>Directory Form</>}
      </h1>

      <h2 className="form__desc">
        {approvalForm ? (
          <>
            For approving new or existing coops. If existing coop, updated data
            will be shown in red.
          </>
        ) : (
          <>
            Use this form to add or request the update of a solidarity entity or
            cooperative. We'll contact you to confirm the information
          </>
        )}
      </h2>
      <h2 className="form__desc">
        <span style={{ color: 'red' }}>*</span> = required
      </h2>
      {loadErrors && (
        <strong className="form__error-message">
          {JSON.stringify(loadErrors)}
        </strong>
      )}
      {loadingCoopData && <strong>Loading entity data...</strong>}
      <div className="form">
        <form
          onSubmit={submitForm}
          className="container-fluid"
          id="directory-add-update"
          noValidate
        >
          <FormGroup>
            <div className="form-row">
              <div className="form-group col-md-6 col-lg-4 col-xl-3">
                <Input
                  className={'required'}
                  type={'text'}
                  title={'Cooperative/Entity Name'}
                  name={'coop_name'}
                  value={coopName}
                  placeholder={'Cooperative/entity name'}
                  handleChange={(e) => setCoopName(e.target.value)}
                  errors={errors}
                />{' '}
              </div>
              <AddressInputGroup
                street={street}
                city={city}
                state={state}
                zip={zip}
                county={county}
                country={country}
                addressPublic={addressPublic}
                index
                setStreet={setStreet}
                setCity={setCity}
                setState={setState}
                setZip={setZip}
                setCounty={setCounty}
                setCountry={setCountry}
                setAddressPublic={setAddressPublic}
                errors={errors}
                provinces={provinces}
                countries={countries}
              />

              <div className="form-group col-md-12">
                <Input
                  className={'required'}
                  type={'text'}
                  title={
                    'Website or Social Media Page (separate multiple links with a comma)'
                  }
                  name={'websites'}
                  value={websites}
                  placeholder={'Website or social media pages'}
                  handleChange={(e) => setWebsites(e.target.value)}
                  errors={errors}
                />{' '}
              </div>

              {contactMethods &&
                contactMethods.map((contact, index) => (
                  <ContactMethodInput
                    key={index}
                    prefix={'General'}
                    contactMethod={contact}
                    index={index}
                    handleContactMethodChange={handleContactMethodChange}
                    errors={errors}
                  />
                ))}
              <div className="form-group col-md-4 col-lg-4">
                <Button
                  buttonType={'primary'}
                  title={'Add Contact Method'}
                  type={'button'}
                  action={addContactMethodField}
                />
              </div>
              <div className="form-group col-md-6 col-lg-6"></div>
              {contactPerson &&
                contactPerson.map((person, index) => (
                  <ContactPersonInput
                   key={index}
                    person={person}
                    index={index}
                    handlePersonChange={handlePersonChange}
                    handleContactMethodChange={handlePersonContactChange}
                    errors={errors}
                  />
                ))}
              <div className="form-group col-md-4 col-lg-4">
                <Button
                  buttonType={'primary'}
                  title={'Add Contact Person'}
                  type={'button'}
                  action={addContactPerson}
                />
              </div>
              <div className="form-group col-md-6 col-lg-6"></div>
              <div className="col-12">
                {/* TODO verify if label should also be hidden if input is hidden
                error The label's for attribute doesn't match any element id */}
                <Input
                  type={'hidden'}
                  title={''}
                  name={'contact'}
                  value={''}
                  placeholder={'Contact info'}
                  errors={errors}
                  required={0}
                />{' '}
              </div>
              <div className="form-group col-md-6 col-lg-6">
                <DropDownInput
                  className={'required'}
                  type={'select'}
                  as={'select'}
                  title={'Entity types'}
                  multiple={'multiple'}
                  name={'entity_types'}
                  value={entityTypes}
                  handleChange={(e) =>
                    setEntityTypes(
                      [].slice
                        .call(e.target.selectedOptions)
                        .map((item) => item.value)
                    )
                  }
                  options={entities}
                  errors={errors}
                />
              </div>
              <div className="form-group col-md-6 col-lg-4">
                <DropDownInput
                  type={'select'}
                  as={'select'}
                  title={'Scope of Service'}
                  name={'scope'}
                  value={scope}
                  multiple={''}
                  handleChange={(e) => setScope(e.target.value)}
                  options={[
                    { id: 'local', name: 'Local' },
                    { id: 'regional', name: 'Regional' },
                    { id: 'national', name: 'National' },
                    { id: 'international', name: 'International' },
                  ]}
                />
              </div>
              <div className="form-group col-md-12 col-lg-12 col-xl-10">
                <Input
                  type={'text'}
                  title={'Add description tags here, separated by commas'}
                  name={'tags'}
                  value={tags}
                  placeholder={'Enter tags'}
                  handleChange={(e) => setTags(e.target.value)}
                  errors={errors}
                />{' '}
              </div>
              <div className="form-group col-md-12 col-lg-6 col-xl-4">
                <TextAreaInput
                  type={'textarea'}
                  as={'textarea'}
                  title={'Entity Description (English)'}
                  name={'description'}
                  value={descEng}
                  placeholder={'Enter entity description (English)'}
                  handleChange={(e) => setDescEng(e.target.value)}
                  errors={errors}
                />{' '}
              </div>
              <div className="form-group col-md-12 col-lg-6 col-xl-4">
                <TextAreaInput
                  type={'textarea'}
                  as={'textarea'}
                  title={'Entity Description (Other Language)'}
                  name={'desc_other'}
                  value={descOther}
                  placeholder={'Enter entity description (Other Language)'}
                  handleChange={(e) => setDescOther(e.target.value)}
                  errors={errors}
                />{' '}
              </div>
              <div className="form-group col-md-8 col-lg-8 col-xl-4">
                <DropDownInput
                  className={'required'}
                  type={'select'}
                  as={'select'}
                  title={'Please list your reason for submitting this request'}
                  name={'req_reason'}
                  value={reqReason}
                  multiple={''}
                  handleChange={(e) => setReqReason(e.target.value)}
                  options={[
                    { id: 'add', name: 'Add new record' },
                    { id: 'update', name: 'Update existing record' },
                  ]}
                />
              </div>
              <div className="form-group col-md-6" align="center">
                {approvalForm ? (
                  <Button
                    buttonType={'primary'}
                    title={'Approve'}
                    type={'submit'}
                  />
                ) : (
                  <Button
                    buttonType={'primary'}
                    title={'Send Addition/Update'}
                    type={'submit'}
                  />
                )}
              </div>
              <div className="form-group col-md-6" align="center">
                <CancelButton id={id} />
              </div>
            </div>
            {errors && (
              <strong className="form__error-message">
                Please correct the errors above and then resubmit.
              </strong>
            )}
          </FormGroup>
        </form>
      </div>
    </div>
  );
}
