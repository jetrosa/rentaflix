import React, {Component} from "react";
import axios from 'axios';
import authService from "../services/auth.service";

const apiUsersUrl = "http://localhost:9000/api/v1/users/";

export default class QueueRented extends Component {
    state = {
        queuedMovies: [],
        rentedMovies: [],
    };

    componentDidMount() {
        this.getQueuedMovies();
        this.getActiveRentedMovies();
    }

    getQueuedMovies() {
        axios.get(apiUsersUrl + authService.getCurrentUser().CustomerId + '/queue')
            .then(res => {
                console.log(res);
                this.setState({queuedMovies: res.data});
            }).catch(err => {
            console.log(err);
        });
    }

    getActiveRentedMovies() {
        axios.get(apiUsersUrl+ authService.getCurrentUser().CustomerId + '/orders/active')
            .then(res => {
                console.log(res);
                this.setState({rentedMovies: res.data});
            }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="col-md-12 RegisterCard">
                Active rented movies:
                {this.state.rentedMovies.map(obj => {
                    return (
                        <div>
                            {obj.Title}
                        </div>
                    );
                })}
                <br/>

                Queue:
                    {this.state.queuedMovies.map(obj => {
                        return (
                            <div>
                                {obj.Title}
                            </div>
                        );
                    })}

            </div>

        );
    }
}