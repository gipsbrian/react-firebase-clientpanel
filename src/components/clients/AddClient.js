import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

class AddClient extends Component {
  // handles the add client requests
  state = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    balance: ""
  };

  onSubmit = e => {
    e.preventDefault();
    const newClient = this.state;
    const { firestore, history } = this.props;

    // if balance is zero
    if (newClient.balance == "") {
      newClient.balance = 0;
    }

    // takes in an obj with the collection we are adding to, and record be want to add
    firestore
      .add({ collection: "clients" }, newClient)
      .then(() => history.push("/"));
  };
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  render() {
    const { disableBalanceOnAdd } = this.props.settings;
    return (
      <div className="row">
        <div className="col-md-3">
          <Link to="/">
            <i className="fas fa-arrow-circle-left" /> Back To Dashboard
          </Link>
        </div>
        <div className="col-md-6">
          <div className="card ">
            <div className="card-header">Add Client</div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="firstName"
                    minLength="2"
                    required
                    onChange={this.onChange}
                    value={this.state.firstName}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="lastName"
                    minLength="2"
                    required
                    onChange={this.onChange}
                    value={this.state.lastName}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    required
                    onChange={this.onChange}
                    value={this.state.email}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    className="form-control"
                    type="text"
                    name="phone"
                    minLength="10"
                    required
                    onChange={this.onChange}
                    value={this.state.phone}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="balance">Balance</label>
                  <input
                    className="form-control"
                    type="text"
                    name="balance"
                    onChange={this.onChange}
                    value={this.state.balance}
                    disabled={disableBalanceOnAdd}
                  />
                </div>
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddClient.propTypes = {
  firestore: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};
export default compose(
  firestoreConnect(),
  connect((state, props) => ({
    settings: state.settings
  }))
)(AddClient);
