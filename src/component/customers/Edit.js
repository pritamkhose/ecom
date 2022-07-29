import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Badge, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

const GET_CUSTOMER = gql`
  query customer($id: ID!) {
    customer(id: $id) {
      id
      name
      producer
      rating
    }
  }
`;

const UPDATE_CUSTOMER = gql`
  mutation updateCustomer($id: ID!, $name: String!, $producer: String!, $rating: Float!) {
    updateCustomer(id: $id, name: $name, producer: $producer, rating: $rating) {
      id
      name
      producer
      rating
    }
  }
`;

const ADD_CUSTOMER = gql`
  mutation addCustomer($name: String!, $producer: String!, $rating: Float!) {
    addCustomer(name: $name, producer: $producer, rating: $rating) {
      id
      name
      producer
      rating
    }
  }
`;

const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      id
    }
  }
`;

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEdit, setEdit] = useState(!!id);

  const showForm = (action, loading, error, data) => {
    let name, producer, rating;
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Edit</h3>
          </div>
          <div className="panel-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                isEdit
                  ? action({
                      variables: {
                        id,
                        name: name.value,
                        producer: producer.value,
                        rating: parseInt(rating.value)
                      }
                    })
                  : action({
                      variables: {
                        name: name.value,
                        producer: producer.value,
                        rating: parseInt(rating.value) // parseFloat(rating.value).toFixed(2),
                      }
                    });
                // name.value = "";
                // producer.value = "";
                // rating.value = 0;
              }}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  ref={(node) => {
                    name = node;
                  }}
                  placeholder="Name"
                  defaultValue={data ? data.customer.name : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="producer">Producer:</label>
                <input
                  type="text"
                  className="form-control"
                  name="producer"
                  ref={(node) => {
                    producer = node;
                  }}
                  placeholder="Producer"
                  defaultValue={data ? data.customer.producer : ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rating">Rating:</label>
                <input
                  type="number"
                  step="1"
                  className="form-control"
                  name="rating"
                  ref={(node) => {
                    rating = node;
                  }}
                  placeholder="Rating"
                  defaultValue={data ? data.customer.rating : ''}
                />
              </div>
              <br />
              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </form>
            {loading && showLoading()}
            {error && <p>Error :( Please try again</p>}
          </div>
        </div>
      </div>
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
      <Badge variant="primary">Customer {isEdit ? 'Edit' : 'Add'}</Badge>
      <br />
      <br />
      <h4>
        <Link to="/customers" className="btn btn-primary">
          Customer List
        </Link>
      </h4>
      <hr />
      {isEdit ? (
        <Query query={GET_CUSTOMER} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return showLoading();
            if (error) return `Error! ${error.message}`;

            return (
              <>
                <Mutation mutation={UPDATE_CUSTOMER} onCompleted={() => navigate('/customers')}>
                  {(updateCustomer, { loading, error }) =>
                    showForm(updateCustomer, loading, error, data)
                  }
                </Mutation>
                <Mutation
                  mutation={DELETE_CUSTOMER}
                  key={data.customer.id}
                  onCompleted={() => navigate('/customers')}>
                  {(deleteCustomer, { loading, error }) => (
                    <div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          deleteCustomer({
                            variables: { id: data.customer.id }
                          });
                        }}>
                        <div className="container panel-body">
                          <br />
                          <button type="submit" className="btn btn-danger">
                            Delete
                          </button>
                          <br />
                          <br />
                        </div>
                      </form>
                      {loading && showLoading()}
                      {error && <p>Error :( Please try again</p>}
                    </div>
                  )}
                </Mutation>
              </>
            );
          }}
        </Query>
      ) : (
        <Mutation
          mutation={ADD_CUSTOMER}
          onCompleted={(customer) => {
            navigate(`${'/customer/edit'}/${customer.addCustomer.id}`);
          }}>
          {(addCustomer, { loading, error }) => showForm(addCustomer, loading, error, null)}
        </Mutation>
      )}
    </div>
  );
};

export default Edit;
