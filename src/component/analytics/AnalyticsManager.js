import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga";

class AnalyticsManager extends Component {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      ReactGA.pageview(
        this.props.location.pathname + this.props.location.search
      );
    }
  }

  render() {
    return <></>;
  }
}

export default withRouter(AnalyticsManager);
