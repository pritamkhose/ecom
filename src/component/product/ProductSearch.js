import React from "react";
import logo from "../../image/logo.svg";
import { withRouter } from "react-router-dom";

const ProductSearch = (props) => {
  return (
    <>
      <div className="text-center py-3">
        <img src={logo} alt="Search" height="90"></img>
      </div>
      <br />
      <div style={{ margin: "12px" }}>
        <form
          className="searchinput"
          onSubmit={(e) => {
            e.preventDefault();
            props.handleClose();
            props.history.push("/products?search=" + e.target.search.value);
          }}
        >
          {/* action="/products" */}
          <input
            type="text"
            placeholder="Search ..."
            name="search"
            id="search"
          />
          <button type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
      <br />
    </>
  );
};

export default withRouter(ProductSearch);
