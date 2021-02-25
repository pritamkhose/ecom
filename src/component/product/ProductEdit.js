import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Container, Spinner, Badge, Button, Card } from "react-bootstrap";
import { Form } from "react-final-form";
import { Label } from "reactstrap";
import axios from "axios";

import FormFieldText from "./FormFieldText";
import FormFieldNumber from "./FormFieldNumber";
import "./ProductEdit.css";
import SampleFormGenerator from "./SampleFormGenerator";

class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      aObj: {},
      isEdit: props.match.params.id ? true : false,
      isLoading: props.match.params.id === "new" ? false : true,
      isLogined: localStorage.getItem("name") ? true : false,
    };
    this.getData(props.match.params.id);
  }

  getData(id) {
    if (id === "new") {
    } else if (id === undefined) {
      this.props.history.push("/products");
    } else {
      var baseURL =
        (process.env.REACT_APP_API_URL !== undefined
          ? process.env.REACT_APP_API_URL
          : "") + "/api/";
      axios
        .post(baseURL + "mongoclient/id?collection=productmyntra&id=" + id, {})
        .then(
          (response) => {
            this.setState({ aObj: response.data });
          },
          (error) => {
            console.log(error);
            this.setState({ isLoading: false });
            alert("Something went Wrong! Try again...");
          }
        );
    }
  }

  render() {
    return (
      <div>
        <Badge variant="primary">
          Product {this.state.isEdit ? "Edit" : "Add"}
        </Badge>
        {this.state.aObj !== undefined && this.state.aObj !== null
          ? this.showData()
          : this.showLoading()}
      </div>
    );
  }

  showData() {
    return (
      <Container>
        <Form
          onSubmit={(values) => this.onFormSubmit(values)}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <Card>
                <p>ProductId : {this.state.aObj.productId}</p>
                <p>Date: {this.state.aObj.catalogDate}</p>
              </Card>
              <Card>
                <FormFieldText
                  name="category"
                  hint="Category"
                  value={this.state.aObj.category}
                />
                <FormFieldText
                  name="brand"
                  hint="Brand"
                  value={this.state.aObj.brand}
                />
              </Card>
              <Card>
                <FormFieldText
                  name="product"
                  hint="Product"
                  value={this.state.aObj.product}
                />
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
                <FormFieldText
                  name="gender"
                  hint="Gender"
                  value={this.state.aObj.gender}
                />
                <FormFieldText
                  name="primaryColour"
                  hint="Colour"
                  value={this.state.aObj.primaryColour}
                />
                <FormFieldText
                  name="season"
                  hint="Season"
                  value={this.state.aObj.season}
                />
              </Card>
              <Card>
                <FormFieldNumber
                  name="rating"
                  hint="Rating"
                  value={this.state.aObj.rating}
                />
                <FormFieldNumber
                  name="ratingCount"
                  hint="Rating Count"
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
                  value={this.state.aObj.discount}
                />
                <FormFieldNumber
                  name="mrp"
                  hint="MRP"
                  value={this.state.aObj.mrp}
                />
                <FormFieldNumber
                  name="price"
                  hint="Price"
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
              <Card>sizes</Card>
              <Card>
                inventoryInfo
                "skuId":39345494,"label":"UK9","inventory":208,"available":true
              </Card>
              <Card>
                <Label>Images</Label>
                {this.state.aObj.images?.map((item, i) => (
                  <FormFieldText
                    key={i}
                    name={item.view}
                    hint="Image URL"
                    value={item.src}
                  />
                ))}
              </Card>
              <Card>productVideos</Card>

              <div className="buttons">
                {this.state.id === "new" ? null : (
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
        {/* <p>{JSON.stringify(this.state.aObj)} </p> */}
        <hr/><hr/><hr/>
        <SampleFormGenerator />
      </Container>
    );
  }

  openLink() {
    this.props.history.push("/products");
  }

  onFormSubmit(values) {
    values.date = new Date().toISOString();
    values.uid = localStorage.getItem("uid");
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";

    this.setState({
      isLoading: true,
    });
    var actionURL =
      this.state.id === "new"
        ? baseURL + "mongoclient/insert" + "?collection=productmyntra"
        : baseURL +
          "mongoclient/updateone" +
          "?collection=productmyntra&id=" +
          this.state.id;
    console.log(values);
    // axios.put(actionURL, values).then(
    //   (response) => {
    //     // console.log(response.data);
    //     this.props.history.push("/products");
    //   },
    //   (error) => {
    //     this.setState(
    //       {
    //         isLoading: false,
    //       },
    //       function () {
    //         console.log(error);
    //         alert("Something went Wrong! Try again...");
    //       }
    //     );
    //   }
    // );
  }

  deleteData() {
    var baseURL =
      (process.env.REACT_APP_API_URL !== undefined
        ? process.env.REACT_APP_API_URL
        : "") + "/api/";

    this.setState({
      isLoading: true,
    });
    // axios
    //   .delete(
    //     baseURL +
    //       "mongoclient/delete?collection=address&id=" +
    //       this.state.address[0]["_id"],
    //     {}
    //   )
    //   .then(
    //     (response) => {
    //       // console.log(response.data);
    //       this.props.history.push("/products");
    //     },
    //     (error) => {
    //       this.setState(
    //         {
    //           isLoading: false,
    //         },
    //         function () {
    //           console.log(error);
    //           alert("Something went Wrong! Try again...");
    //         }
    //       );
    //     }
    //   );
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
    var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
      navigator.userAgent.toLowerCase()
    );
    // console.log(navigator.userAgent.toLowerCase());
    // console.log(isMobile);
    return isMobile;
  }
}

export default withRouter(ProductEdit);
