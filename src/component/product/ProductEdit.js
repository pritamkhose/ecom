import React, { Component } from 'react';

import { Container, Spinner, Badge, Button, Card, Row } from 'react-bootstrap';
import { Label } from 'reactstrap';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import axios from 'axios';

import FormFieldText from './FormFieldText';
import FormFieldNumber from './FormFieldNumber';
import FormFieldCheckBox from './FormFieldCheckBox';
import './ProductEdit.css';

class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      aObj: {},
      isLogined: !!localStorage.getItem('name')
    };
  }

  componentDidMount() {
    if (localStorage.getItem('uid')) {
      if (this.state.id === 'new') {
        this.setState({ isLoading: false, isEdit: false });
      } else {
        this.setState({ isLoading: true, isEdit: true });
        this.getData(this.state.id);
      }
    } else {
      this.props.history.push('/login');
    }
  }

  getData(id) {
    if (id === 'new') {
      console.log('-->', 'new id');
    } else {
      const baseURL =
        (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') +
        '/api/';
      axios.post(baseURL + 'mongoclient/id?collection=productmyntra&id=' + id, {}).then(
        (response) => {
          if (response.status === 200) {
            this.setState({ isLoading: false, aObj: response.data });
          } else {
            this.setState({ isLoading: false });
            alert('Something went Wrong! Try again...');
            this.openLink(true);
          }
        },
        (error) => {
          console.log(error);
          this.setState({ isLoading: false });
          alert('Invaild ID!');
          this.openLink(true);
        }
      );
    }
  }

  render() {
    return (
      <div>
        <Badge variant="primary">Product {this.state.isEdit ? 'Edit' : 'Add'}</Badge>
        {this.state.isLoading ? this.showLoading() : this.showData()}
      </div>
    );
  }

  showData() {
    return (
      <Container>
        <Form
          onSubmit={(values) => this.onFormSubmit(values)}
          initialValues={{
            category: this.state.aObj.category,
            brand: this.state.aObj.brand,
            product: this.state.aObj.product,
            productName: this.state.aObj.productName,
            additionalInfo: this.state.aObj.additionalInfo,
            gender: this.state.aObj.gender,
            primaryColour: this.state.aObj.primaryColour,
            season: this.state.aObj.season,
            rating: this.state.aObj.rating,
            ratingCount: this.state.aObj.ratingCount,
            discountDisplayLabel: this.state.aObj.discountDisplayLabel,
            discount: this.state.aObj.discount,
            mrp: this.state.aObj.mrp,
            price: this.state.aObj.price,
            sizes: this.state.aObj.sizes,
            searchImage: this.state.aObj.searchImage,
            landingPageUrl: this.state.aObj.landingPageUrl,
            images: this.state.aObj.images !== undefined ? this.state.aObj.images : [],
            productVideos:
              this.state.aObj.productVideos !== undefined ? this.state.aObj.productVideos : [],
            inventoryInfo:
              this.state.aObj.inventoryInfo !== undefined ? this.state.aObj.inventoryInfo : []
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
                  <p>ProductId : {this.state.aObj.productId}</p>
                  <p>Date: {this.state.aObj.catalogDate}</p>
                </Card>
                <Card>
                  <FormFieldText name="category" hint="Category" value={this.state.aObj.category} />
                  <FormFieldText name="brand" hint="Brand" value={this.state.aObj.brand} />
                </Card>
                <Card>
                  <FormFieldText name="product" hint="Product" value={this.state.aObj.product} />
                  <FormFieldText
                    name="productName"
                    hint="Product Name"
                    value={this.state.aObj.productName}
                  />
                  <FormFieldText
                    name="additionalInfo"
                    hint="Additional Info"
                    value={this.state.aObj.additionalInfo}
                  />
                </Card>
                <Card>
                  <FormFieldText name="gender" hint="Gender" value={this.state.aObj.gender} />
                  <FormFieldText
                    name="primaryColour"
                    hint="Colour"
                    value={this.state.aObj.primaryColour}
                  />
                  <FormFieldText name="season" hint="Season" value={this.state.aObj.season} />
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
                    value={this.state.aObj.rating}
                  />
                  <FormFieldNumber
                    name="ratingCount"
                    hint="Rating Total Count"
                    min="0"
                    minLength="1"
                    value={this.state.aObj.ratingCount}
                  />
                </Card>
                <Card>
                  <FormFieldText
                    name="discountDisplayLabel"
                    hint="Discount Display Label"
                    value={this.state.aObj.discountDisplayLabel}
                  />
                  <FormFieldNumber
                    name="discount"
                    hint="Discount"
                    min="0"
                    minLength="1"
                    value={this.state.aObj.discount}
                  />
                  <FormFieldNumber
                    name="mrp"
                    hint="MRP"
                    min="0"
                    minLength="1"
                    value={this.state.aObj.mrp}
                  />
                  <FormFieldNumber
                    name="price"
                    hint="Price"
                    min="0"
                    minLength="1"
                    value={this.state.aObj.price}
                  />
                </Card>
                <Card>
                  <FormFieldText
                    name="searchImage"
                    hint="Search Image URL"
                    value={this.state.aObj.searchImage}
                  />
                  <FormFieldText
                    name="landingPageUrl"
                    hint="Landing Page URL"
                    value={this.state.aObj.landingPageUrl}
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
                                this.state.aObj.images !== undefined &&
                                this.state.aObj.images[index] !== undefined
                                  ? this.state.aObj.images[index].view
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
                                this.state.aObj.images !== undefined &&
                                this.state.aObj.images[index] !== undefined
                                  ? this.state.aObj.images[index].src
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
                                this.state.aObj.productVideos !== undefined &&
                                this.state.aObj.productVideos[index] !== undefined
                                  ? this.state.aObj.productVideos[index].view
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
                                this.state.aObj.productVideos !== undefined &&
                                this.state.aObj.productVideos[index] !== undefined
                                  ? this.state.aObj.productVideos[index].src
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
                  <FormFieldText name="sizes" hint="Sizes" value={this.state.aObj.sizes} />
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
                                this.state.aObj.inventoryInfo !== undefined &&
                                this.state.aObj.inventoryInfo[index] !== undefined
                                  ? this.state.aObj.inventoryInfo[index].skuId
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
                                this.state.aObj.inventoryInfo !== undefined &&
                                this.state.aObj.inventoryInfo[index] !== undefined
                                  ? this.state.aObj.inventoryInfo[index].label
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
                                this.state.aObj.inventoryInfo !== undefined &&
                                this.state.aObj.inventoryInfo[index] !== undefined
                                  ? this.state.aObj.inventoryInfo[index].inventory
                                  : ''
                              }
                            />
                          </div>
                          <div className="col-sm-2">
                            <FormFieldCheckBox
                              name={`${name}.available`}
                              hint="Available"
                              value={
                                this.state.aObj.inventoryInfo !== undefined &&
                                this.state.aObj.inventoryInfo[index] !== undefined
                                  ? this.state.aObj.inventoryInfo[index].available
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
                  {this.state.id === 'new' ? null : (
                    <>
                      <Button className="btn btn-danger" onClick={() => this.deleteData()}>
                        Delete
                      </Button>
                      &nbsp;&nbsp;&nbsp;
                    </>
                  )}
                  <Button className="btn btn-warning" onClick={() => this.openLink(false)}>
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
                <pre>{JSON.stringify(this.state.aObj, 0, 2)}</pre> */}
              </form>
            );
          }}
        />
      </Container>
    );
  }

  openLink(isListOpen) {
    if (isListOpen || this.state.id === 'new') {
      this.props.history.push('/products');
    } else {
      this.props.history.push('/pid/' + this.state.id);
    }
  }

  onFormSubmit(values) {
    values.catalogDate = new Date().getTime();
    values.date = new Date().toISOString();
    values.uid = localStorage.getItem('uid');
    if (this.state.id === 'new') {
      const min = 10000000;
      const max = 99999999;
      values.productId = Math.floor(min + Math.random() * max);
    } else {
      values.productId = this.state.aObj.productId;
    }
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';

    this.setState({
      isLoading: true
    });
    const actionURL =
      this.state.id === 'new'
        ? baseURL + 'mongoclient/insert' + '?collection=productmyntra'
        : baseURL + 'mongoclient/updateone' + '?collection=productmyntra&id=' + this.state.aObj._id;
    axios.put(actionURL, values).then(
      (response) => {
        // console.log(response.data);
        this.props.history.push('/products');
      },
      (error) => {
        this.setState(
          {
            isLoading: false
          },
          function () {
            console.log(error);
            alert('Something went Wrong! Try again...');
          }
        );
      }
    );
  }

  deleteData() {
    const baseURL =
      (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : '') + '/api/';

    this.setState({
      isLoading: true
    });
    axios
      .delete(baseURL + 'mongoclient/delete?collection=productmyntra&id=' + this.state.aObj._id, {})
      .then(
        (response) => {
          // console.log(response.data);
          this.props.history.push('/products');
        },
        (error) => {
          this.setState(
            {
              isLoading: false
            },
            function () {
              console.log(error);
              alert('Something went Wrong! Try again...');
            }
          );
        }
      );
  }

  showLoading() {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" role="status" variant="info">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  isMobile() {
    // if we want a more complete list use this: http://detectmobilebrowsers.com/
    // str.test() is more efficent than str.match() remember str.test is case sensitive
    const isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
      navigator.userAgent.toLowerCase()
    );
    // console.log(navigator.userAgent.toLowerCase());
    // console.log(isMobile);
    return isMobile;
  }
}

export default ProductEdit;
