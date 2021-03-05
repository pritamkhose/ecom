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
import FormFieldText from "./FormFieldText";
import FormFieldNumber from "./FormFieldNumber";

class AddressEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressID: props.match.params.id,
      isLoading: props.match.params.id === "new" ? false : true,
      address: [],
    };

    if (localStorage.getItem("uid")) {
      this.getData(this.state.addressID);
    } else {
      this.props.history.push("/login");
    }
  }

  getData(addressID) {
    if (addressID === "new") {
      // console.log(addressID);
    } else if (addressID === undefined) {
      this.props.history.push("/address");
    } else {
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
                  this.state.address.length === 1 &&
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
        <Badge variant="primary" style={{ background: "#007bff" }}>
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
              <FormFieldText
                name="firstName"
                hint="First Name"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].firstName
                    : ""
                }
              />
              <FormFieldText
                name="lastName"
                hint="Last Name"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].lastName
                    : ""
                }
              />
              <FormFieldNumber
                name="mobileno"
                hint="Mobile number"
                minLength="10"
                maxLength="10"
                min="999999999"
                max="9999999999"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].mobileno
                    : ""
                }
              />
              <FormFieldText
                name="address"
                hint="Flat, House no., Building, Company, Apartment"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].address
                    : ""
                }
              />
              <FormFieldText
                name="area"
                hint="Area, Colony, Street, Sector, Village"
                placeholder="Enter Area"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].area
                    : ""
                }
              />
              <FormFieldText
                name="landmark"
                hint="Landmark"
                placeholder="E.g. Near Flyover, Behind Cinema, etc."
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].landmark
                    : ""
                }
              />
              <FormFieldText
                name="country"
                hint="Country"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].country
                    : ""
                }
              />
              <FormFieldNumber
                name="pincode"
                hint="Pincode"
                minLength="6"
                maxLength="6"
                min="99999"
                max="999999"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].pincode
                    : ""
                }
              />
              <FormFieldText
                name="state"
                hint="State"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].state
                    : ""
                }
              />
              <FormFieldText
                name="city"
                hint="City"
                value={
                  this.state.address.length === 1
                    ? this.state.address[0].city
                    : ""
                }
              />
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
