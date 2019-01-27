import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";

class EditClient extends Component {
  constructor(props) {
    super(props);

    this.firstNameInput = React.createRef();
    this.lastNameInput = React.createRef();
    this.eamilInput = React.createRef();
    this.phoneInput = React.createRef();
    this.balanceInput = React.createRef();
  }

  onSubmit = e => {
    e.preventDefault();

    const { firestore, client, history } = this.props;

    // Update client details
    const updClient = {
      firstName: this.firstNameInput.current.value,
      lastName: this.lastNameInput.current.value,
      email: this.eamilInput.current.value,
      phone: this.phoneInput.current.value,
      balance:
        this.balanceInput.current.value === ""
          ? 0
          : this.balanceInput.current.value
    };

    // update cleints
    firestore
      .update({ collection: "clients", doc: client.id }, updClient)
      .then(history.push("/"));
  };
  render() {
    const { client } = this.props;
    const { disableBalanceOnEdit } = this.props.settings;

    if (client) {
      return (
        <div>
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
                        ref={this.firstNameInput}
                        defaultValue={client.firstName}
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
                        ref={this.lastNameInput}
                        defaultValue={client.lastName}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        name="email"
                        required
                        ref={this.eamilInput}
                        defaultValue={client.email}
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
                        ref={this.phoneInput}
                        defaultValue={client.phone}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="balance">Balance</label>
                      <input
                        className="form-control"
                        type="text"
                        name="balance"
                        ref={this.balanceInput}
                        defaultValue={client.balance}
                        disabled={disableBalanceOnEdit}
                      />
                    </div>
                    <input
                      type="submit"
                      value="Edit Client"
                      className="btn btn-primary btn-block"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

EditClient.propTypes = {
  firestore: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    {
      collection: "clients",
      storeAs: "client",
      doc: props.match.params.id
    }
  ]),
  connect(({ firestore: { ordered }, settings }, props) => ({
    client: ordered.client && ordered.client[0],
    settings
  }))
)(EditClient);
