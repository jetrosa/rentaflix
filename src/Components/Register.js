import React, { Component } from "react";
import axios from 'axios';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

/**
 * Returns an error alert if a field in the login form hasn't been filled
 * @param value - checks if a field has been filled
 * @returns alert
 */
const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

/**
 * Returns an alert if email is not valid
 * @param value - email input by user
 * @returns alert div
 */
const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};

/**
 * Returns alert if firstName isn't between 2 and 30 characters
 * @param value - firstName input by user
 * @returns alert div
 */
const vfirstName = value => {
    if (value.length < 2 || value.length > 30) {
        return (
            <div className="alert alert-danger" role="alert">
                The firstName must be between 2 and 30 characters.
            </div>
        );
    }
};

/**
 * Returns alert if lastName isn't between 2 and 30 characters
 * @param value - lastName input by user
 * @returns alert div
 */
const vlastName = value => {
    if (value.length < 2 || value.length > 30) {
        return (
            <div className="alert alert-danger" role="alert">
                The lastName must be between 2 and 30 characters.
            </div>
        );
    }
};

const apiUrl = "http://localhost:9000/api/v1/register/";

/**
 * Component for registering an account
 * @component
 * @extends Component
 */
export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangefirstName = this.onChangefirstName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangelastName = this.onChangelastName.bind(this);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            currentSub: 1,
            successful: false,
            message: ""
        };
    }

    /**
     * Method for setting firstName field value to state
     * @param e - firstName input by user
     */
    onChangefirstName(e) {
        this.setState({
            firstName: e.target.value
        });
    }

    /**
     * Method for setting email field value to state
     * @param e - email input by user
     */
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    /**
     * Method for setting lastName field value to state
     * @param e - lastName input by user
     */
    onChangelastName(e) {
        this.setState({
            lastName: e.target.value
        });
    }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        const newUser = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            currentSub: this.state.currentSub,
        };


        if (this.checkBtn.context._errors.length === 0) {
            axios.post(apiUrl, newUser)
                .then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    /**
     * Render function for the register component
     * @returns the register form
     */
    render() {
        return (
            <div className="col-md-12 RegisterCard">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Form
                        onSubmit={this.handleRegister}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="firstName">First name</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        value={this.state.firstName}
                                        onChange={this.onChangefirstName}
                                        validations={[required, vfirstName]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last name</label>
                                    <Input
                                        type="lastName"
                                        className="form-control"
                                        name="lastName"
                                        value={this.state.lastName}
                                        onChange={this.onChangelastName}
                                        validations={[required, vlastName]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validations={[required, email]}
                                    />
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary btn-block">Sign Up</button>
                                </div>
                            </div>
                        )}

                        {this.state.message && (
                            <div className="form-group">
                                <div
                                    className={
                                        this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{ display: "none" }}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}