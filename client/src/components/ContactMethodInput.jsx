import React from 'react';
import DropDownInput from './DropDownInput';
import Input from './Input';

const ContactMethodInput = ({
  contactMethod,
  index,
  handleContactMethodChange,
  errors,
  prefix = '',
  parent,
}) => {
  const { type, is_public, phone, email, id } = contactMethod;
  const inputType = type === 'PHONE' ? 'phone' : 'email';
  const value = type === 'PHONE' ? phone : email;
  const title =
    type === 'PHONE'
      ? `${prefix} Contact Phone Number`
      : `${prefix} Contact Email Address`;
  const placeholder = type === 'PHONE' ? 'Contact phone' : 'Contact email';
  const valueType = type === 'PHONE' ? 'phone' : 'email';
  const typeLabel = type === 'PHONE' ? 'Phone' : 'Email';

  return (
    <>
      <div key={id} className="form-group col-md-4 col-lg-4">
        <Input
          className={'required'}
          errors={errors}
          handleChange={(e) => handleContactMethodChange(e, valueType)}
          index={index}
          name={'contact_method_type' + parent + index}
          parent={parent}
          placeholder={placeholder}
          title={title}
          type={inputType}
          value={value}
        />{' '}
      </div>
      <div key={id} className="form-group col-md-4 col-lg-4">
        <DropDownInput
          as={'select'}
          className={'required'}
          handleChange={(e) => handleContactMethodChange(e, 'type')}
          index={index}
          parent={parent}
          multiple={''}
          name={'contact_method_type' + parent + index}
          options={[
            { id: 'phone', name: 'PHONE' },
            { id: 'email', name: 'EMAIL' },
          ]}
          title={`Type`}
          type={'select'}
          value={type}
        />
      </div>
      <div key={id} className="form-group col-md-4 col-lg-4">
        <DropDownInput
          as={'select'}
          className={'required'}
          handleChange={(e) => handleContactMethodChange(e, 'is_public')}
          index={index}
          parent={parent}
          multiple={''}
          name={parent + index}
          options={[
            { id: 'yes', name: 'Yes' },
            { id: 'no', name: 'No' },
          ]}
          type={'select'}
          title={`Is ${typeLabel} to be public on the map?`}
          value={is_public}
        />
      </div>
    </>
  );
};

export default ContactMethodInput;
