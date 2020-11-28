import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const GET_CUSTOMERS = gql`
  {
    customers {
      id
      name
      producer
      rating
    }
  }
`;

class Home extends Component {
  render() {
    return (
      <Query query={GET_CUSTOMERS}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;

          return (
            <div className="container">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4>
                    <Link to="/customers/edit" className="btn btn-primary">
                      Add Customer
                    </Link>
                  </h4>
                </div>
                <div className="panel-body">
                  <table className="table table-stripe">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Producer</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.customers.map((customer, index) => (
                        <tr key={index}>
                          <td>
                            <Link to={`${"/customer/edit"}/${customer.id}`}>
                              {customer.name}
                            </Link>
                          </td>
                          <td>{customer.producer}</td>
                          <td>{customer.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Home;
