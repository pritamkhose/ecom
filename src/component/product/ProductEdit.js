import React, { useEffect, useState } from 'react';
import axios from 'axios';
import arrayMutators from 'final-form-arrays';
import { Badge, Button, Card, Container, Row, Spinner } from 'react-bootstrap';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from 'reactstrap';
import FormFieldCheckBox from './FormFieldCheckBox';
import FormFieldNumber from './FormFieldNumber';
import FormFieldText from './FormFieldText';
import './ProductEdit.css';

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [aObj, setaObj] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isLogined, setLogined] = useState(!!localStorage.getItem('name'));

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      if (id === 'new') {
        setLoading(false);
        setEdit(false);
      } else {
        setLoading(true);
        setEdit(true);
        getData(id);
      }
    } else {
      navigate('/login');
    }
  }, []);

  const getData = (id) => {
    if (id === 'new') {
      console.log('id -->', id);
    } else {
      const baseURL =
        (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
        '/api/';
      axios.post(baseURL + 'mongoclient/id?collection=productmyntra&id=' + id, {}).then(
        (response) => {
          if (response.status === 200) {
            setLoading(false);
            setaObj(response.data);
          } else {
            setLoading(false);
            alert('Something went Wrong! Try again...');
            openLink(true);
          }
        },
        (error) => {
          console.log(error);
          setLoading(false);
          alert('Invaild ID!');
          openLink(true);
        }
      );
    }
  };

  const showData = () => {
    return (
      <Container>
        <Form
          onSubmit={(values) => onFormSubmit(values)}
          initialValues={{
            category: aObj.category,
            brand: aObj.brand,
            product: aObj.product,
            productName: aObj.productName,
            additionalInfo: aObj.additionalInfo,
            gender: aObj.gender,
            primaryColour: aObj.primaryColour,
            season: aObj.season,
            rating: aObj.rating,
            ratingCount: aObj.ratingCount,
            discountDisplayLabel: aObj.discountDisplayLabel,
            discount: aObj.discount,
            mrp: aObj.mrp,
            price: aObj.price,
            sizes: aObj.sizes,
            searchImage: aObj.searchImage,
            landingPageUrl: aObj.landingPageUrl,
            images: aObj.images !== undefined ? aObj.images : [],
            productVideos: aObj.productVideos !== undefined ? aObj.productVideos : [],
            inventoryInfo: aObj.inventoryInfo !== undefined ? aObj.inventoryInfo : []
          }}
          mutators={{
            ...arrayMutators
          }}
          render={({
            handleSubmit,
            form: {
              mutators: { push, pop }
            }, // injected from final-form-arrays above
            pristine,
            form,
            submitting,
            values
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Card>
                  <p>ProductId : {aObj.productId}</p>
                  <p>Date: {aObj.catalogDate}</p>
                </Card>
                <Card>
                  <FormFieldText name="category" hint="Category" value={aObj.category} />
                  <FormFieldText name="brand" hint="Brand" value={aObj.brand} />
                </Card>
                <Card>
                  <FormFieldText name="product" hint="Product" value={aObj.product} />
                  <FormFieldText name="productName" hint="Product Name" value={aObj.productName} />
                  <FormFieldText
                    name="additionalInfo"
                    hint="Additional Info"
                    value={aObj.additionalInfo}
                  />
                </Card>
                <Card>
                  <FormFieldText name="gender" hint="Gender" value={aObj.gender} />
                  <FormFieldText name="primaryColour" hint="Colour" value={aObj.primaryColour} />
                  <FormFieldText name="season" hint="Season" value={aObj.season} />
                </Card>
                <Card>
                  <FormFieldNumber
                    name="rating"
                    hint="Rating"
                    min="0"
                    max="5"
                    minLength="1"
                    maxLength="1"
                    step="0.01"
                    value={aObj.rating}
                  />
                  <FormFieldNumber
                    name="ratingCount"
                    hint="Rating Total Count"
                    min="0"
                    minLength="1"
                    value={aObj.ratingCount}
                  />
                </Card>
                <Card>
                  <FormFieldText
                    name="discountDisplayLabel"
                    hint="Discount Display Label"
                    value={aObj.discountDisplayLabel}
                  />
                  <FormFieldNumber
                    name="discount"
                    hint="Discount"
                    min="0"
                    minLength="1"
                    value={aObj.discount}
                  />
                  <FormFieldNumber name="mrp" hint="MRP" min="0" minLength="1" value={aObj.mrp} />
                  <FormFieldNumber
                    name="price"
                    hint="Price"
                    min="0"
                    minLength="1"
                    value={aObj.price}
                  />
                </Card>
                <Card>
                  <FormFieldText
                    name="searchImage"
                    hint="Search Image URL"
                    value={aObj.searchImage}
                  />
                  <FormFieldText
                    name="landingPageUrl"
                    hint="Landing Page URL"
                    value={aObj.landingPageUrl}
                  />
                </Card>
                <Card>
                  <Container className="row" style={{ paddingStart: '25px' }}>
                    <Label>Images&nbsp;&nbsp;&nbsp;</Label>
                    <span onClick={() => push('images', undefined)} style={{ cursor: 'pointer' }}>
                      ➕
                    </span>
                  </Container>
                  <FieldArray name="images">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <Row key={name}>
                          <div className="col-sm-1">
                            <label>{index + 1}. </label>
                          </div>
                          <div className="col-sm-2">
                            <FormFieldText
                              name={`${name}.view`}
                              hint="Type"
                              label={false}
                              value={
                                aObj.images !== undefined && aObj.images[index] !== undefined
                                  ? aObj.images[index].view
                                  : ''
                              }
                            />
                          </div>
                          <div className="col-sm-8">
                            <FormFieldText
                              name={`${name}.src`}
                              hint="URL"
                              label={false}
                              value={
                                aObj.images !== undefined && aObj.images[index] !== undefined
                                  ? aObj.images[index].src
                                  : ''
                              }
                            />
                          </div>
                          <div className="col-sm-1">
                            <span
                              onClick={() => fields.remove(index)}
                              style={{ cursor: 'pointer' }}>
                              ❌
                            </span>
                          </div>
                        </Row>
                      ))
                    }
                  </FieldArray>
                </Card>
                <Card>
                  <Container className="row" style={{ paddingStart: '25px' }}>
                    <Label>Videos&nbsp;&nbsp;&nbsp;</Label>
                    <span
                      onClick={() => push('productVideos', undefined)}
                      style={{ cursor: 'pointer' }}>
                      ➕
                    </span>
                  </Container>
                  <FieldArray name="productVideos">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <Row key={name}>
                          <div className="col-sm-1">
                            <label>{index + 1}. </label>
                          </div>
                          <div className="col-sm-2">
                            <FormFieldText
                              name={`${name}.view`}
                              hint="Type"
                              label={false}
                              value={
                                aObj.productVideos !== undefined &&
                                aObj.productVideos[index] !== undefined
                                  ? aObj.productVideos[index].view
                                  : ''
                              }
                            />
                          </div>
                          <div className="col-sm-8">
                            <FormFieldText
                              name={`${name}.src`}
                              hint="URL"
                              label={false}
                              value={
                                aObj.productVideos !== undefined &&
                                aObj.productVideos[index] !== undefined
                                  ? aObj.productVideos[index].src
                                  : ''
                              }
                            />
                          </div>
                          <div className="col-sm-1">
                            <span
                              onClick={() => fields.remove(index)}
                              style={{ cursor: 'pointer' }}>
                              ❌
                            </span>
                          </div>
                        </Row>
                      ))
                    }
                  </FieldArray>
                </Card>
                <Card>
                  <FormFieldText name="sizes" hint="Sizes" value={aObj.sizes} />
                </Card>
                <Card>
                  <Container className="row" style={{ paddingStart: '25px' }}>
                    <Label>Inventory Info&nbsp;&nbsp;&nbsp;</Label>
                    <span
                      onClick={() => push('inventoryInfo', undefined)}
                      style={{ cursor: 'pointer' }}>
                      ➕
                    </span>
                  </Container>
                  <FieldArray name="inventoryInfo">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <Row key={name}>
                          <div className="col-sm-1">
                            <label>{index + 1}. </label>
                          </div>
                          <div className="col-sm-3">
                            <FormFieldNumber
                              name={`${name}.skuId`}
                              hint="Sku Id"
                              label={false}
                              min="0"
                              minLength="1"
                              value={
                                aObj.inventoryInfo !== undefined &&
                                aObj.inventoryInfo[index] !== undefined
                                  ? aObj.inventoryInfo[index].skuId
                                  : ''
                              }
                            />
                          </div>
                          <div className="col-sm-2">
                            <FormFieldText
                              name={`${name}.label`}
                              hint="Label"
                              label={false}
                              value={
                                aObj.inventoryInfo !== undefined &&
                                aObj.inventoryInfo[index] !== undefined
                                  ? aObj.inventoryInfo[index].label
                                  : ''
                              }
                            />
                          </div>
                          <div className="col-sm-3">
                            <FormFieldNumber
                              name={`${name}.inventory`}
                              hint="Inventory Count"
                              label={false}
                              min="0"
                              minLength="1"
                              value={
                                aObj.inventoryInfo !== undefined &&
                                aObj.inventoryInfo[index] !== undefined
                                  ? aObj.inventoryInfo[index].inventory
                                  : ''
                              }
                            />
                          </div>
                          <div className="col-sm-2">
                            <FormFieldCheckBox
                              name={`${name}.available`}
                              hint="Available"
                              value={
                                aObj.inventoryInfo !== undefined &&
                                aObj.inventoryInfo[index] !== undefined
                                  ? aObj.inventoryInfo[index].available
                                  : false
                              }
                            />
                          </div>
                          <div className="col-sm-1">
                            <span
                              onClick={() => fields.remove(index)}
                              style={{ cursor: 'pointer' }}>
                              ❌
                            </span>
                          </div>
                        </Row>
                      ))
                    }
                  </FieldArray>
                </Card>
                <div className="buttons">
                  <br />
                  {id === 'new' ? null : (
                    <>
                      <Button className="btn btn-danger" onClick={() => deleteData()}>
                        Delete
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                    </>
                  )}
                  <Button className="btn btn-warning" onClick={() => openLink(false)}>
                    Cancel
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    className="btn btn-primary"
                    onClick={form.reset}
                    disabled={submitting || pristine}>
                    Reset
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    className="btn btn-success"
                    type="submit"
                    disabled={submitting || pristine}>
                    Submit
                  </Button>
                </div>
                {/* <pre>{JSON.stringify(values, 0, 2)}</pre>
                <pre>{JSON.stringify(aObj, 0, 2)}</pre> */}
              </form>
            );
          }}
        />
      </Container>
    );
  };

  const openLink = (isListOpen) => {
    if (isListOpen || id === 'new') {
      navigate('/products');
    } else {
      navigate('/pid/' + id);
    }
  };

  const onFormSubmit = (values) => {
    values.catalogDate = new Date().getTime();
    values.date = new Date().toISOString();
    values.uid = localStorage.getItem('uid');
    if (id === 'new') {
      const min = 10000000;
      const max = 99999999;
      values.productId = Math.floor(min + Math.random() * max);
    } else {
      values.productId = aObj.productId;
    }
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';

    setLoading(true);
    const actionURL =
      id === 'new'
        ? baseURL + 'mongoclient/insert' + '?collection=productmyntra'
        : baseURL + 'mongoclient/updateone' + '?collection=productmyntra&id=' + aObj._id;
    axios.put(actionURL, values).then(
      (response) => {
        navigate('/products');
      },
      (error) => {
        setLoading(false);
        console.log(error);
        alert('Something went Wrong! Try again...');
      }
    );
  };

  const deleteData = () => {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';

    setLoading(true);
    axios.delete(baseURL + 'mongoclient/delete?collection=productmyntra&id=' + aObj._id, {}).then(
      (response) => {
        navigate('/products');
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
        <Spinner animation="border" role="status" variant="info">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  };

  return (
    <div>
      <Badge variant="primary">Product {isEdit ? 'Edit' : 'Add'}</Badge>
      {isLoading ? showLoading() : showData()}
    </div>
  );
};

export default ProductEdit;
