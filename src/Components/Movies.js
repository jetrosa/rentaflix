import React from "react";
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion'
import Card from "react-bootstrap/Card";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import authService from "../services/auth.service";

/**
 * API Call URL for all movies
 * @type {string}
 */
const apimoviesUrl = "http://localhost:9000/api/v1/movies/";

const apiUsersUrl = "http://localhost:9000/api/v1/users/";


/**
 * Component for listing movies from API. The user can click the movies to open more information about them.
 * They can also add a movie in their Rents which saves the movie in another list containing only
 * the user's Rents.
 * @component
 * @extends React.Component
 */
export default class List extends React.Component {

    state = {
        movies: [],
        searchText: "",
        genres: [],
        selectedGenre: "",
        searchIdActor: ""
    };

    componentDidMount() {
        this.handleGenreSelectionChange = this.handleGenreSelectionChange.bind(this);
        this.getGenres();
        this.searchmovies();
    }



    handleChange = event => {
        const target = event.target;
        const name = target.name;
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        this.setState({[name]: value});
    };

    /**
     * Method for success alert when adding to Rents
     */
    onShowAddedRent = () => {
        this.setState({Rent: true}, () => {
            window.setTimeout(() => {
                this.setState({Rent: false})
            }, 3000)
        });
    };

    /**
     * Method for error alert when adding to Rents (e.g. movie is already in Rents)
     */
    onShowError = () => {
        this.setState({error: true}, () => {
            window.setTimeout(() => {
                this.setState({error: false})
            }, 3000)
        });
    };

    getGenres() {
        axios.get(apimoviesUrl + 'genres')
            .then(res => {
                this.setState({genres: res.data});
            }).catch(err => {
        });
    }

    /**
     * Method for posting a movie into Rents
     * @param movieId
     */
    addToRent(movieId) {
        axios.post(apiUsersUrl + 'rented', {userId: authService.getCurrentUser().id, movieId: movieId})
            .then(res => {
                this.setState({success: true});
                this.onShowAddedRent()
            }).catch(err => {
            this.setState({error: true});
            this.onShowError();
            if (err.response) {
                this.setState({errorMessage: err.response});
                // client received an error response (5xx, 4xx)
                console.log('post error with code', err.response);
            } else if (err.request) {
                this.setState({errorMessage: err.request});
                // client never received a response, or request never left
                console.log('communication error', err.request);
            } else {
                this.setState({errorMessage: 'Oops! Try again'});
                console.log("Post error");
            }
        });
    }

    addToQueue(movieId) {
        axios.post(apiUsersUrl + authService.getCurrentUser().CustomerId +'/queue', {movieId: movieId})
            .then(res => {
                this.setState({success: true});
                this.onShowAddedRent()
            }).catch(err => {
            this.setState({error: true});
            this.onShowError();
        });
    }

    /**
     * Method for filtering the movie list
     */
    searchmovies() {
        const searchText = this.state.searchText;
        const limit = 50;
        axios.get(apimoviesUrl, {params: {limit: limit, title: searchText}})
            .then(res => {
                console.log(res);
                this.setState({movies: res.data});
                console.log("state", this.state.movies);
            }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Method for filtering the movie list
     */
    searchMoviesByActor() {
        const searchId = this.state.searchIdActor;
        const limit = 50;
        axios.get(apimoviesUrl + '/search/actors', {params: {limit: limit, actors: searchId}})
            .then(res => {
                console.log(res);
                this.setState({movies: res.data});
                console.log("state", this.state.movies);
            }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Retrieve top movie list (most rented)
     */
    topMovies() {
        axios.get(apimoviesUrl + '/top')
            .then(res => {
                console.log(res);
                this.setState({movies: res.data});
                console.log("state", this.state.movies);
            }).catch(err => {
            console.log(err);
        });
    }

    getAvailableMovies() {
        axios.get(apimoviesUrl+'available', {params: {genre: this.state.selectedGenre}})
            .then(res => {
                console.log(res);
                this.setState({movies: res.data});
                console.log("state", this.state.movies);
            }).catch(err => {
            console.log(err);
        });
    }

    handleGenreSelectionChange(e) {
        this.setState({selectedGenre: e.target.value});
        //console.log("state", this.state.selectedGenre);
    }

    /**
     * Render function for the list component
     * @returns the list
     */
    render() {


        return (
            <div className="List">
                {this.state.error && <Alert className="RentErrorAlert" variant="danger" isopen="true">
                    Error adding to queue!
                </Alert>}
                {this.state.Rent && <Alert className="RentSuccessAlert" variant="success" isopen="true">
                    Added to queue!
                </Alert>}
                <div className="AccordionList">
                    <div className="SearchBar">
                        <Form className="SearchBarForm">
                            <Col xs="auto">
                                <Form.Control
                                    name="searchText"
                                    className="mb-2"
                                    id="inlineFormInput"
                                    placeholder="Search by name"
                                    onChange={this.handleChange}
                                />
                                <Form.Control
                                    name="searchIdActor"
                                    className="mb-2"
                                    id="inlineFormInput"
                                    placeholder="Search by actors"
                                    onChange={this.handleChange}
                                />
                                <Button onClick={() => this.searchMoviesByActor()} id="ListFilterButton" variant="success"
                                        className="mb-2">
                                    Search
                                </Button>

                            </Col>
                            <Col className="CheckboxColumn" xs="auto">
                                <Form.Check
                                    type="checkbox"
                                    id="autoSizingCheck"
                                    className="mb-2"
                                    onChange={this.handleChange}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button onClick={() => this.searchmovies()} id="ListFilterButton" variant="success"
                                        className="mb-2">
                                    Search
                                </Button>
                                <Button onClick={() => this.topMovies()} id="ListFilterButton" variant="success"
                                        className="mb-2">
                                    Top
                                </Button>
                            </Col>
                            <div className="drop-down">
                                <p>Find available by genre </p>
                                <select onChange={this.handleGenreSelectionChange}>
                                    {this.state.genres.map((option) => (
                                        <option value={option.Name}>{option.Name}</option>
                                    ))}
                                </select>
                                <Button onClick={() => this.getAvailableMovies(this.state.selectedGenre)}
                                        id="ListFilterButton" variant="success"
                                        className="mb-2">
                                    Search
                                </Button>
                            </div>
                        </Form>
                    </div>
                    <div className="Scrollbar">
                        {this.state.movies.map(movie => (
                            <Accordion defaultActiveKey="1">
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            {movie.Title}
                                        </Accordion.Toggle>
                                        <div className="divider"/>
                                        <Button onClick={() => this.addToRent(movie.Id)}
                                                className="addButton">Rent</Button>
                                        <Button onClick={() => this.addToQueue(movie.Id)}
                                                className="addButton">Queue</Button>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            genre: {movie.Genre}<br/>
                                            copies available: {movie.NumCopies}<br/>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        ))}
                    </div>
                </div>

            </div>
        )
    }
}
