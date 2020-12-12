import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Container,
  Spinner,
  Badge,
  Button,
  FormGroup,
  Label,
} from "reactstrap";
import { Form, Field } from "react-final-form";
import axios from "axios";

const required = (value) => (value ? undefined : "");

const mustBeNumber = (value) => (isNaN(value) ? "Must be a number" : undefined);

// const minValue = (min) => (value) =>
//   isNaN(value) || value >= min ? undefined : `Should be greater than ${min}`;

const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);

// const onChange = () => (e) => {
//   const re = /^[0-9\b]+$/;
//   if (e.target.value === "" || re.test(e.target.value)) {
//     this.setState({ value: e.target.value });
//   }
// };

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values, address) => {
  // await sleep(300);
  // window.alert(JSON.stringify(values, 0, 2));
  var baseURL =
    (process.env.REACT_APP_API_URL !== undefined
      ? process.env.REACT_APP_API_URL
      : "") + "/api/";
  console.log(values, address);
  var body = [values];
  console.log(body);
  // axios
  //   .put(
  //     baseURL +
  //       "mongoclient/updateone?collection=address&id=" +
  //       localStorage.getItem("uid"),
  //     { data: body }
  //   )
  //   .then(
  //     (response) => {
  //       console.log(response.data);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
};

const AddressEdit = (props) => {
  const [address, setAddress] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const addressID = props.match.params.id;
  var length = 9;
  var addressItemID = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, length);
  const [tempID, setTempID] = useState(addressItemID);

  useEffect(() => {
    if (addressID === "new") {
      console.log(tempID, address);
    } else if (addressID === undefined) {
      props.history.push("/address");
    } else {
      if (localStorage.getItem("uid")) {
        var baseURL =
          (process.env.REACT_APP_API_URL !== undefined
            ? process.env.REACT_APP_API_URL
            : "") + "/api/";
        setLoading(true);
        axios
          .post(
            baseURL +
              "mongoclient/id?collection=address&id=" +
              localStorage.getItem("uid"),
            {}
          )
          .then(
            (response) => {
              setLoading(false);
              setAddress(response.data);
              setTempID(addressID);
              response.data !== undefined &&
              addressID < response.data.data.length ? (
                <p></p>
              ) : (
                props.history.push("/address")
              );
            },
            (error) => {
              console.log(error);
              setLoading(false);
              setAddress([]);
            }
          );
      } else {
        props.history.push("/login");
      }
    }
  }, []);

  return (
    <div>
      <Badge variant="primary">
        {addressID !== undefined && addressID === "new"
          ? "Add new address"
          : "Edit address"}
      </Badge>
      {/* {isLoading && 
        ? showLoading()
        : showData(address.data, props, addressID)} */}
      {addressID === "new" && addressID !== undefined
        ? showData(address, props, addressID)
        : isLoading
        ? showLoading()
        : address != undefined && address.data != undefined
        ? showData(address.data[addressID], props, addressID)
        : null}
    </div>
  );
};

const showLoading = () => {
  return (
    <div className="text-center py-3">
      <Spinner animation="border" role="status" variant="primary" />
    </div>
  );
};

const isMobile = () => {
  var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
    navigator.userAgent.toLowerCase()
  );
  return isMobile;
};

const openLink = (props) => {
  props.history.push("/address");
};

const showData = (data, props, addressID) => {
  return (
    <Container>
      {/* {addressID}-- {JSON.stringify(data)} */}
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <Field name="atype" validate={composeValidators(required)}>
              {({ input, meta}) => (
                <FormGroup>
                  <Label>Address Type</Label>
                  <Field
                    type="select"
                    defaultValue="Home"
                    name="atype"
                    component="select"
                    className="form-control"
                    defaultValue={
                      data.atype !== undefined ? data.atype : "Home"
                    }
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Billing">Billing</option>
                    <option value="Other">Other</option>
                  </Field>
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="firstName" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormGroup>
                  <Label>First Name</Label>
                  <Field
                    required
                    type="text"
                    name="firstName"
                    className="form-control"
                    component="input"
                    placeholder="Enter First Name"
                    defaultValue={
                      data.firstName !== undefined ? data.firstName : ""
                    }
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="lastName" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormGroup>
                  <Label>Last Name</Label>
                  <Field
                    required
                    type="text"
                    name="lastName"
                    className="form-control"
                    component="input"
                    placeholder="Enter Last Name"
                    defaultValue={
                      data.lastName !== undefined ? data.lastName : ""
                    }
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="mobileno" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormGroup>
                  <Label>Mobile number</Label>
                  <Field
                    required
                    minLength="10"
                    maxLength="10"
                    min="999999999"
                    max="9999999999"
                    type={isMobile ? "number" : "text"}
                    name="mobileno"
                    className="form-control"
                    component="input"
                    placeholder="Enter Mobile number"
                    defaultValue={
                      data.mobileno !== undefined ? data.mobileno : ""
                    }
                    // onChange={this.onChange}
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="address" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormGroup>
                  <Label>Flat, House no., Building, Company, Apartment</Label>
                  <Field
                    required
                    type="text"
                    name="address"
                    className="form-control"
                    component="input"
                    placeholder="Enter Address"
                    defaultValue={
                      data.address !== undefined ? data.address : ""
                    }
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="area" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormGroup>
                  <Label>Area, Colony, Street, Sector, Village</Label>
                  <Field
                    required
                    type="text"
                    name="area"
                    className="form-control"
                    component="input"
                    placeholder="Enter Area"
                    defaultValue={data.area !== undefined ? data.area : ""}
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="landmark">
              {({ input, meta }) => (
                <FormGroup>
                  <Label>Landmark</Label>
                  <Field
                    type="text"
                    name="landmark"
                    className="form-control"
                    component="input"
                    placeholder="E.g. Near Flyover, Behind Cinema, etc."
                    defaultValue={
                      data.landmark !== undefined ? data.landmark : ""
                    }
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="country" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormGroup>
                  <Label>Country</Label>
                  <Field
                    required
                    type="text"
                    name="country"
                    className="form-control"
                    component="input"
                    placeholder="Enter country"
                    defaultValue={
                      data.country !== undefined ? data.country : ""
                    }
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field
              name="pincode"
              validate={composeValidators(required, mustBeNumber)} // , minValue(18)
            >
              {({ input, meta }) => (
                <FormGroup>
                  <Label>Pincode</Label>
                  <Field
                    required
                    minLength="6"
                    maxLength="6"
                    min="99999"
                    max="999999"
                    type={isMobile ? "number" : "text"}
                    name="pincode"
                    className="form-control"
                    component="input"
                    placeholder="Enter Pincode"
                    defaultValue={
                      data.pincode !== undefined ? data.pincode : ""
                    }
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="state" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormGroup>
                  <Label>Sate</Label>
                  <Field
                    required
                    type="text"
                    name="state"
                    className="form-control"
                    component="input"
                    placeholder="Enter state"
                    defaultValue={data.state !== undefined ? data.state : ""}
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <Field name="city" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormGroup>
                  <Label>City</Label>
                  <Field
                    required
                    type="text"
                    name="city"
                    className="form-control"
                    component="input"
                    placeholder="Enter city"
                    defaultValue={data.city !== undefined ? data.city : ""}
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormGroup>
              )}
            </Field>
            <div className="buttons">
              {addressID === "new" ? null : (
                <>
                  <Button
                    color="danger"
                    type="button"
                    onClick={() => openLink(props)}
                  >
                    Delete
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                </>
              )}
              <Button
                color="warning"
                type="button"
                onClick={() => openLink(props)}
              >
                Cancel
              </Button>
              <>&nbsp;&nbsp;&nbsp;</>
              <Button
                type="button"
                color="primary"
                onClick={form.reset}
                disabled={submitting || pristine}
              >
                Reset
              </Button>
              <>&nbsp;&nbsp;&nbsp;</>
              <Button type="submit" color="success" disabled={submitting}>
                Submit
              </Button>
            </div>
            <br />
          </form>
        )}
      />
    </Container>
  );
};

export default withRouter(AddressEdit);
