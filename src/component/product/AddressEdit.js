import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Container, FormGroup, Label, Spinner } from 'reactstrap';
import FormFieldNumber from './FormFieldNumber';
import FormFieldText from './FormFieldText';

const AddressEdit = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      getData(id);
    } else {
      navigate('/login');
    }
  }, [id]);

  const getData = (id) => {
    if (id === 'new') {
      // console.log(id);
    } else if (id === undefined) {
      navigate('/address');
    } else {
      const baseURL =
        (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
        '/api/';
      axios
        .post(baseURL + 'mongoclient?collection=address', {
          search: {
            uid: localStorage.getItem('uid'),
            addrid: id
          }
        })
        .then(
          (response) => {
            setLoading(false);
            const tempAddr = response.data;
            if (tempAddr.length === 1 && tempAddr[0].addrid === id) {
              setAddress(tempAddr);
            } else {
              navigate('/address');
            }
          },
          (error) => {
            console.log(error);
            setLoading(false);
            setAddress([]);
            alert('Something went Wrong! Try again...');
          }
        );
    }
  };

  const onFormSubmit = (values) => {
    values.date = new Date().toISOString();
    values.uid = localStorage.getItem('uid');
    const length = 9;
    values.addrid = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, length);
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';

    setLoading(true);
    const actionURL =
      id === 'new'
        ? baseURL + 'mongoclient/insert' + '?collection=address'
        : baseURL + 'mongoclient/updateone' + '?collection=address&id=' + address[0]._id;
    axios.put(actionURL, values).then(
      (response) => {
        navigate('/address');
      },
      (error) => {
        setLoading(true);
        console.log(error);
        alert('Something went Wrong! Try again...');
      }
    );
  };

  const deleteData = () => {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';

    setLoading(true);
    axios.delete(baseURL + 'mongoclient/delete?collection=address&id=' + address[0]._id, {}).then(
      (response) => {
        // console.log(response.data);
        navigate('/address');
      },
      (error) => {
        setLoading(false);
        console.log(error);
        alert('Something went Wrong! Try again...');
      }
    );
  };

  const showLoading = () => {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );
  };

  const openLink = () => {
    navigate('/address');
  };

  const showData = () => {
    return (
      <Container>
        <Form
          onSubmit={(values) => onFormSubmit(values)}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <Field name="atype" validate={composeValidators(required)}>
                {({ input, meta }) => (
                  <FormGroup>
                    <Label>Address Type</Label>
                    <Field
                      type="select"
                      name="atype"
                      component="select"
                      className="form-control"
                      defaultValue={address?.[0]?.atype?.length > 0 ? address[0].atype : 'Home'}>
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
                value={address?.[0]?.firstName?.length > 0 ? address[0].firstName : ''}
              />
              <FormFieldText
                name="lastName"
                hint="Last Name"
                value={address.length === 1 ? address[0].lastName : ''}
              />
              <FormFieldNumber
                name="mobileno"
                hint="Mobile number"
                minLength="10"
                maxLength="10"
                min="999999999"
                max="9999999999"
                value={address.length === 1 ? address[0].mobileno : ''}
              />
              <FormFieldText
                name="address"
                hint="Flat, House no., Building, Company, Apartment"
                value={address.length === 1 ? address[0].address : ''}
              />
              <FormFieldText
                name="area"
                hint="Area, Colony, Street, Sector, Village"
                placeholder="Enter Area"
                value={address.length === 1 ? address[0].area : ''}
              />
              <FormFieldText
                name="landmark"
                hint="Landmark"
                placeholder="E.g. Near Flyover, Behind Cinema, etc."
                value={address.length === 1 ? address[0].landmark : ''}
              />
              <FormFieldText
                name="country"
                hint="Country"
                value={address.length === 1 ? address[0].country : ''}
              />
              <FormFieldNumber
                name="pincode"
                hint="Pincode"
                minLength="6"
                maxLength="6"
                min="99999"
                max="999999"
                value={address.length === 1 ? address[0].pincode : ''}
              />
              <FormFieldText
                name="state"
                hint="State"
                value={address.length === 1 ? address[0].state : ''}
              />
              <FormFieldText
                name="city"
                hint="City"
                value={address.length === 1 ? address[0].city : ''}
              />
              <div className="buttons">
                {id === 'new' ? null : (
                  <>
                    <Button color="danger" type="button" onClick={() => deleteData()}>
                      Delete
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                  </>
                )}
                <Button color="warning" type="button" onClick={() => openLink()}>
                  Cancel
                </Button>
                <>&nbsp;&nbsp;&nbsp;</>
                <Button
                  type="button"
                  color="primary"
                  onClick={form.reset}
                  disabled={submitting || pristine}>
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

  const required = (value) => {
    return value ? undefined : '';
  };

  const composeValidators =
    (...validators) =>
    (value) =>
      validators.reduce((error, validator) => error || validator(value), undefined);

  return (
    <div>
      <Badge variant="primary" style={{ background: '#007bff' }}>
        {id !== undefined && id === 'new' ? 'Add new address' : 'Edit address'}
      </Badge>
      {isLoading ? showLoading() : showData()}
    </div>
  );
};

export default AddressEdit;
