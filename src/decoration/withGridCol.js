import React, { Component } from "react";
import PropTypes from "prop-types";

import Grid from "material-ui/Grid";

export function withGridCol(comp) {
  return class extends Component {
    render() {
      return (
        <Grid container direction="column" alignItems="stretch">
          <comp {...this.props} />
        </Grid>
      );
    }
  };
}
