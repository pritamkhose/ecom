import React from "react";
import { FormGroup, Label } from "reactstrap";
import { Field } from "react-final-form";

const FormFieldNumber = (props) => {
  function required(value) {
    return value ? undefined : "";
  }

  function mustBeNumber(value) {
    return isNaN(value) ? "Must be a number" : undefined;
  }

  function invalidLength(value) {
    return value.maxLength < value ? "Invalid input" : undefined;
  }

  const composeValidators = (...validators) => (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );

  return (
    <Field
      name={props.name}
      validate={composeValidators(required, mustBeNumber, invalidLength)}
    >
      {({ input, meta }) => (
        <FormGroup>
          {props.label === false ? null : <Label>{props.hint}</Label>}
          <Field
            required
            type="number"
            minLength={props.minLength}
            maxLength={props.maxLength}
            min={props.min}
            max={props.max}
            name={props.name}
            className="form-control"
            component="input"
            placeholder={
              props.placeholder !== undefined
                ? props.placeholder
                : "Enter " + props.hint
            }
            defaultValue={props.value !== undefined ? props.value : 0}
          />
          {meta.error && meta.touched && <span>{meta.error}</span>}
        </FormGroup>
      )}
    </Field>
  );
};

export default FormFieldNumber;
