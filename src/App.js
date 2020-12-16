import logo from './logo.svg';
import './App.css';

import React from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
//import Home from "./Components/Home";
//import AuthService from "./services/auth.service";

import "bootstrap/dist/css/bootstrap.min.css";
import NavItem from "react-bootstrap/NavItem";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Movies from "./Components/Movies";
import Register from "./Components/Register";
import Profile from "./Components/LoginProfile";
import Queue from "./Components/QueueRented";
import Orders from "./Components/Orders";

function App() {
    return (
        <Router>
            <div className="App">
                <div className="Header">
                    <Navbar bg="transparent" variant="light">
                        <Navbar.Brand as={Link} to="/home">
                            RentaFlix
                        </Navbar.Brand>
                        <Nav className="mr-auto">
                            {
                                <NavItem>
                                    <Nav.Link as={Link} to="/movies">
                                        Browse
                                    </Nav.Link>
                                </NavItem>
                            }
                            {
                                <NavItem>
                                    <Nav.Link as={Link} to="/register">
                                        Register
                                    </Nav.Link>
                                </NavItem>
                            }
                            {
                                <NavItem>
                                    <Nav.Link as={Link} to="/profile">
                                        Profile
                                    </Nav.Link>
                                </NavItem>
                            }
                            {
                                <NavItem>
                                    <Nav.Link as={Link} to="/queue">
                                        Queue
                                    </Nav.Link>
                                </NavItem>
                            }
                            {
                                <NavItem>
                                    <Nav.Link as={Link} to="/orders">
                                        Orders
                                    </Nav.Link>
                                </NavItem>
                            }
                        </Nav>
                    </Navbar>
                </div>
                <div className="Main">
                    <Route exact path="/movies" component={Movies}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/profile" component={Profile}/>
                    <Route exact path="/queue" component={Queue}/>
                    <Route exact path="/orders" component={Orders}/>
                </div>
            </div>
        </Router>
    );
}

export default App;
