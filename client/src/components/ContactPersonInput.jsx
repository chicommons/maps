import React from 'react';
import DropDownInput from './DropDownInput';
import Input from './Input';
import ContactMethodInput from './ContactMethodInput';

const ContactPersonInput = ({
  person,
  index,
  handlePersonChange,
  handleContactMethodChange,
  errors,
}) => {
  const {
    first_name = '',
    last_name = '',
    is_public = false,
    contact_methods = [],
  } = person;

  /**
   * @typedef {object} ContactObject
   * @property {string} email - the email of the entity
   * @property {string} phone - the phone number of the entity
   * @property {boolean} is_public - whether the contact information is public
   * @property  type - the type of contact information
   * @property {('EMAIL'|'PHONE')} type - the type of contact information
   * @property {number} id - the id of the contact information
   */

  /** @type {ContactObject[]} */
  const contactMethods =
    contact_methods?.length > 0
      ? contact_methods
      : [
          {
            type: 'PHONE',
            is_public: 'yes',
            phone: '',
            email: '',
          },
        ];

  return (
    <>
      <div className="form-group col-md-4 col-lg-4">
        <Input
          className={'required'}
          errors={errors}
          handleChange={(e) => handlePersonChange(e, 'first_name')}
          index={index}
          name={'contact_first_name' + index}
          placeholder={'Contact first name'}
          title={'Cooperative/Entity Contact First Name'}
          type={'text'}
          value={first_name}
        />
      </div>
      <div className="form-group col-md-4 col-lg-4">
        <Input
          className={'required'}
          errors={errors}
          handleChange={(e) => handlePersonChange(e, 'last_name')}
          index={index}
          name={'contact_last_name' + index}
          placeholder={'Contact last name'}
          title={'Cooperative/Entity Contact Last Name'}
          type={'text'}
          value={last_name}
        />
      </div>
      <div className="form-group col-md-4 col-lg-4">
        <DropDownInput
          as={'select'}
          className={'required'}
          handleChange={(e) => handlePersonChange(e, 'is_public')}
          index={index}
          multiple={''}
          name={'contact_person_public' + index}
          options={[
            { id: 'yes-id', name: 'Yes' },
            { id: 'no-id', name: 'No' },
          ]}
          title={'Is Contact name to be public on the map?'}
          type={'select'}
          value={is_public}
        />
      </div>
      {contactMethods?.map((contactMethod, i) => (
        <ContactMethodInput
          contactMethod={contactMethod}
          errors={errors}
          handleContactMethodChange={handleContactMethodChange}
          index={i}
          key={index}
          parent={index}
          prefix={'Contact Person'}
        />
      ))}
    </>
  );
};

export default ContactPersonInput;
