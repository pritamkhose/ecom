import React, { Component } from "react";
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

class AddressEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressID: props.match.params.id,
      isLoading: props.match.params.id === "new" ? false : true,
      address: [],
    };
    this.getData(this.state.addressID);
  }

  getData(addressID) {
    if (addressID === "new") {
      // console.log(addressID);
    } else if (addressID === undefined) {
      this.props.history.push("/address");
    } else {
      if (localStorage.getItem("uid")) {
        var baseURL =
          (process.env.REACT_APP_API_URL !== undefined
            ? process.env.REACT_APP_API_URL
            : "") + "/api/";
        axios
          .post(baseURL + "mongoclient?collection=address", {
            search: {
              uid: localStorage.getItem("uid"),
              addrid: this.state.addressID,
            },
          })
          .then(
            (response) => {
              this.setState(
                {
                  isLoading: false,
                  address: response.data,
                },
                function () {
                  if (
                    this.state.address.length == 1 &&
                    this.state.address[0]["addrid"] === this.state.addressID
                  ) {
                  } else {
                    this.props.history.push("/address");
                  }
                }
              );
            },
            (error) => {
              console.log(error);
              this.setState({ isLoading: false, address: [] });
              alert("Something went Wrong! Try again...");
            }
          );
      } else {
        this.props.history.push("/login");
      }
    }
  }

  onFormSubmit(values) {
    values.date = new Date().toISOString();
    values.uid = localStorage.getItem("uid");
    var length = 9;
    values.addrid = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, length);
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";

    this.setState({
      isLoading: true,
    });
    var actionURL =
      this.state.addressID === "new"
        ? baseURL + "mongoclient/insert" + "?collection=address"
        : baseURL +
          "mongoclient/updateone" +
          "?collection=address&id=" +
          this.state.address[0]["_id"];
    axios.put(actionURL, values).then(
      (response) => {
        // console.log(response.data);
        this.props.history.push("/address");
      },
      (error) => {
        this.setState(
          {
            isLoading: false,
          },
          function () {
            console.log(error);
            alert("Something went Wrong! Try again...");
          }
        );
      }
    );
  }

  deleteData() {
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";

    this.setState({
      isLoading: true,
    });
    axios
      .delete(
        baseURL +
          "mongoclient/delete?collection=address&id=" +
          this.state.address[0]["_id"],
        {}
      )
      .then(
        (response) => {
          // console.log(response.data);
          this.props.history.push("/address");
        },
        (error) => {
          this.setState(
            {
              isLoading: false,
            },
            function () {
              console.log(error);
              alert("Something went Wrong! Try again...");
            }
          );
        }
      );
  }

  render() {
    return (
      <div>
        <Badge variant="primary">
          {this.state.addressID !== undefined && this.state.addressID === "new"
            ? "Add new address"
            : "Edit address"}
        </Badge>
        {this.state.isLoading ? this.showLoading() : this.showData()}
      </div>
    );
  }

  showLoading() {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  }

  isMobile() {
    var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
      navigator.userAgent.toLowerCase()
    );
    return isMobile;
  }

  openLink() {
    this.props.history.push("/address");
  }

  showData() {
    return (
      <Container>
        {/* {addressID}-- {JSON.stringify(data)} */}
        <Form
          onSubmit={(values) => this.onFormSubmit(values)}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name="atype"
                validate={this.composeValidators(this.required)}
              >
                {({ input, meta }) => (
                  <FormGroup>
                    <Label>Address Type</Label>
                    <Field
                      type="select"
                      defaultValue="Home"
                      name="atype"
                      component="select"
                      className="form-control"
                      defaultValue={
                        this.state.address.length === 1
                          ? this.state.address[0].atype
                          : "Home"
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
              <Field
                name="firstName"
                validate={this.composeValidators(this.required)}
              >
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
                        this.state.address.length === 1
                          ? this.state.address[0].firstName
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <Field
                name="lastName"
                validate={this.composeValidators(this.required)}
              >
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
                        this.state.address.length === 1
                          ? this.state.address[0].lastName
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <Field
                name="mobileno"
                validate={this.composeValidators(this.required)}
              >
                {({ input, meta }) => (
                  <FormGroup>
                    <Label>Mobile number</Label>
                    <Field
                      required
                      minLength="10"
                      maxLength="10"
                      min="999999999"
                      max="9999999999"
                      type={this.isMobile ? "number" : "text"}
                      name="mobileno"
                      className="form-control"
                      component="input"
                      placeholder="Enter Mobile number"
                      defaultValue={
                        this.state.address.length === 1
                          ? this.state.address[0].mobileno
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <Field
                name="address"
                validate={this.composeValidators(this.required)}
              >
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
                        this.state.address.length === 1
                          ? this.state.address[0].address
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <Field
                name="area"
                validate={this.composeValidators(this.required)}
              >
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
                      defaultValue={
                        this.state.address.length === 1
                          ? this.state.address[0].area
                          : ""
                      }
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
                        this.state.address.length === 1
                          ? this.state.address[0].landmark
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <Field
                name="country"
                validate={this.composeValidators(this.required)}
              >
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
                        this.state.address.length === 1
                          ? this.state.address[0].country
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <Field
                name="pincode"
                validate={this.composeValidators(
                  this.required,
                  this.mustBeNumber
                )}
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
                      type={this.isMobile ? "number" : "text"}
                      name="pincode"
                      className="form-control"
                      component="input"
                      placeholder="Enter Pincode"
                      defaultValue={
                        this.state.address.length === 1
                          ? this.state.address[0].pincode
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <Field
                name="state"
                validate={this.composeValidators(this.required)}
              >
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
                      defaultValue={
                        this.state.address.length === 1
                          ? this.state.address[0].state
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <Field
                name="city"
                validate={this.composeValidators(this.required)}
              >
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
                      defaultValue={
                        this.state.address.length === 1
                          ? this.state.address[0].city
                          : ""
                      }
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </FormGroup>
                )}
              </Field>
              <div className="buttons">
                {this.state.addressID === "new" ? null : (
                  <>
                    <Button
                      color="danger"
                      type="button"
                      onClick={() => this.deleteData()}
                    >
                      Delete
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                  </>
                )}
                <Button
                  color="warning"
                  type="button"
                  onClick={() => this.openLink()}
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
  }

  required(value) {
    return value ? undefined : "";
  }

  mustBeNumber(value) {
    return isNaN(value) ? "Must be a number" : undefined;
  }

  composeValidators = (...validators) => (value) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined
    );
}

export default withRouter(AddressEdit);
