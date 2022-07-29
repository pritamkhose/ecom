import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import { Field } from 'react-final-form';

const FormFieldText = (props) => {
  function required(value) {
    return value ? undefined : '';
  }

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce((error, validator) => error || validator(value), undefined);

  return (
    <Field name={props.name} validate={composeValidators(required)}>
      {({ input, meta }) => (
        <FormGroup>
          {props.label === false ? null : <Label>{props.hint}</Label>}
          <Field
            required
            type="text"
            name={props.name}
            className="form-control"
            component="input"
            placeholder={
              props.placeholder !== undefined ? props.placeholder : 'Enter ' + props.hint
            }
            initialValue={props.value !== undefined && props.value.length > 0 ? props.value : ''}
          />
          {meta.error && meta.touched && <span>{meta.error}</span>}
        </FormGroup>
      )}
    </Field>
  );
};

export default FormFieldText;
