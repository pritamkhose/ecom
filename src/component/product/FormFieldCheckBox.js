import React from "react";
import { FormGroup, Label } from "reactstrap";
import { Field } from "react-final-form";

const FormFieldCheckBox = (props) => {
  function required(value) {
    return value ? undefined : "";
  }

  const composeValidators = (...validators) => (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

  return (
    <Field name={props.name} validate={composeValidators(required)}>
      {({ input, meta }) => (
        <FormGroup>
          <Field
            required
            type="checkbox"
            name={props.name}
            className=""
            component="input"
            defaultValue={
              props.value !== undefined && props.value.length > 0
                ? props.value
                : false
            }
          />
          {props.label === false ? null : <Label>{" "}{props.hint}</Label>}
          {meta.error && meta.touched && <span>{meta.error}</span>}
        </FormGroup>
      )}
    </Field>
  );
};

export default FormFieldCheckBox;
