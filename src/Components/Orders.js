import React, {Component} from "react";
import axios from 'axios';
import authService from "../services/auth.service";
import Card from "react-bootstrap/Card";

const apiUsersUrl = "http://localhost:9000/api/v1/users/";

export default class Orders extends Component {
    state = {
        orderHistoryMovies: []
    };

    componentDidMount() {
        this.getOrderHistoryMovies();
    }

    getOrderHistoryMovies() {
        axios.get(apiUsersUrl+ authService.getCurrentUser().CustomerId + '/orders/all')
            .then(res => {
                console.log(res);
                this.setState({orderHistoryMovies: res.data});
            }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                Order history:
                {this.state.orderHistoryMovies.map(movie => {
                    return (
                        <div>
                            <Card style={{ width: '30rem' }}>
                                {movie.Title}
                                <br/>
                                {movie.RentDate}
                            </Card>
                        </div>

                    );
                })}
                <br/>

            </div>

        );
    }
}