import React, {Component} from "react";
import axios from "axios";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import authService from "../services/auth.service";
import { isEmail } from "validator";

const apiUrl = "http://localhost:9000/api/v1/users/";

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

/**
 * Component for registering an account
 * @component
 * @extends Component
 */
export default class LoginProfile extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleModify = this.handleModify.bind(this);
        this.onChangeUserId = this.onChangeUserId.bind(this);
        this.onChangefirstName = this.onChangefirstName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangelastName = this.onChangelastName.bind(this);

        this.state = {
            userId: "",
            profile: [],
            successful: false
        };
    }

    componentDidMount() {
        const profile = authService.getCurrentUser();
        this.setState({profile: profile});
        console.log(authService.getCurrentUser());
        console.log("profile: " + profile.CustomerId);
    }

    onChangeUserId(e) {
        this.setState({
            userId: e.target.value
        });
    }


    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        axios.get(apiUrl+this.state.userId+'/profile')
            .then(
                response => {
                    authService.login(response.data[0]);
                    this.setState({
                        profile: response.data[0],
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

    handleModify(e) {
        e.preventDefault();

        axios.put(apiUrl+'/profile', this.state.profile)
            .then(
                response => {
                    authService.login(this.state.profile);
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

    /**
     * Method for setting firstName field value to state
     * @param e - firstName input by user
     */
    onChangefirstName(e) {
        const modifiedProfile = this.state.profile;
        modifiedProfile.FirstName = e.target.value;
        this.setState({
            profile: modifiedProfile
        });
    }

    /**
     * Method for setting email field value to state
     * @param e - email input by user
     */
    onChangeEmail(e) {
        const modifiedProfile = this.state.profile;
        modifiedProfile.Email = e.target.value;
        this.setState({
            profile: modifiedProfile
        });
    }

    /**
     * Method for setting lastName field value to state
     * @param e - lastName input by user
     */
    onChangelastName(e) {
        const modifiedProfile = this.state.profile;
        modifiedProfile.LastName = e.target.value;
        this.setState({
            profile: modifiedProfile
        });
    }

    render() {
        return (
            <div className="col-md-12 RegisterCard">
                <div className="card card-container">
                    <Form
                        onSubmit={this.handleLogin}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {(
                            <div>
                                <div className="form-group">
                                    <label htmlFor="userId">UserId</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="userId"
                                        value={this.state.userId}
                                        onChange={this.onChangeUserId}
                                    />
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary btn-block">Login</button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
                {this.state.profile.CustomerId &&(<div>
                    <br/>
                    <br/>
                    Subscription start: {this.state.profile.SubStart}
                    <br/>
                    Subscription end: {this.state.profile.SubEnd}
                    <br/>
                    Current subscription: {this.state.profile.CurrentSub}
                    <br/>
                    Next subscription: {this.state.profile.NextSub}

                    <div className="col-md-12 RegisterCard">
                        <div className="card card-container">
                            <Form
                                onSubmit={this.handleModify}
                                ref={c => {
                                    this.form = c;
                                }}
                            >

                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="firstName">First name</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="firstName"
                                                value={this.state.profile.FirstName}
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
                                                value={this.state.profile.LastName}
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
                                                value={this.state.profile.Email}
                                                onChange={this.onChangeEmail}
                                                validations={[required, email]}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <button className="btn btn-primary btn-block">Apply changes</button>
                                        </div>
                                    </div>

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

                </div>)}
            </div>

        );
    }
}