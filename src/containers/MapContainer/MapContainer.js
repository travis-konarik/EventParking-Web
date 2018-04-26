import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';
import React, {Component} from 'react';
import axios from "axios/index";
import _ from 'underscore';
import {Circle} from "./Circle";

// FOR MY DEMO I HAVE MY PERSONAL GOOGLE API KEY PLUGGED IN HERE
// TO MAKE THIS WORK ELSEWHERE YOU WILL NEED TO USE YOUR OWN.
// In Heroku I use environment/config vars
// import config from './config';
// const apiKey = config.apiKey;
const apiKey = process.env.googleMapsApiKey;

export class MapContainer extends Component {
    parkingPlaces = [
        // _55W_Garage: '60 West Pine Street, Orlando, FL 32801',
        {lat: 28.541290, lng: -81.380336},
        // Administration_Center_Garage: '300 Liberty Avenue, Orlando, FL 32801',
        {lat: 28.539078, lng: -81.375094},
        // Central_Blvd_Garage: '53 West Central Boulevard, Orlando, FL 32801',
        {lat: 28.542125, lng: -81.380396},
        // Centroplex_I_Garage: '441 Ronald Blocker Avenue, Orlando, FL 32801',
        {lat: 28.548954, lng: -81.385538},
        // Courthouse_Garage: '46 East Amelia Street, Orlando, FL 32801',
        {lat: 28.549410, lng: -81.377998},
        // GEICO_Garage: '400 West South Street, Orlando, FL 32805',
        {lat: 28.538234, lng: -81.384026},
        // Garland_Lot: '25 South Garland Avenue, Orlando, FL 32801',
        {lat: 28.541807, lng: -81.381763},
        // Jefferson_Street_Garage: '62 West Jefferson Street, Orlando, FL 32801',
        {lat: 28.544612, lng: -81.380373},
        // Library_Garage: '112 East Central Boulevard, Orlando, FL 32801',
        {lat: 28.542138, lng: -81.376961},
        // Orange_Lot: '522 West Central Boulevard, Orlando, FL 32801',
        {lat: 28.541997, lng: -81.386353},
        // Washington_St_Garage: '50 West Washington Street, Orlando, FL 32801',
        {lat: 28.543532, lng: -81.380291},
    ];

    eventLocations = {
        "Dr Phillips Center": {lat: 28.537702, lng: -81.377463},
        "Amway Center": {lat: 28.540213, lng: -81.383940},
        "Camping World Stadium": {lat: 28.538829, lng: -81.401378},
    };


    static getFormattedDate(m) {
        let out = 'No Date';

        if (m) {
            out = m.format('MMM D, YYYY');
        }

        return out;
    }

    constructor() {
        super();
        this.state = {
            selectedDate: null,
            eventVenues: [],
        };
        this.componentWillUpdate = this.stateWillUpdate.bind(this);
    }

    stateWillUpdate(nextProps, nextState) {
        if (nextState.selectedDate !== this.state.selectedDate) {
            this.getEventVenues(nextState.selectedDate);
        }
    }

    componentDidMount() {
        let m = this.props.selectedDate;
        this.setState({selectedDate: m});
    }


    getParkingMarkers() {
        let markerLocations = [];
        for (let i = 0; i < this.parkingPlaces.length; ++i) {
            markerLocations.push(<Marker
                key={'parking' + i}
                position={this.parkingPlaces[i]}
            />)
        }

        return markerLocations;
    }

    getVenueMarkers() {
        let venues = [];
        for (let i = 0; i < this.state.eventVenues.length; ++i) {
            venues.push(<Circle
                key={'venue' + i}
                position={this.eventLocations[this.state.eventVenues[i]]}
                radius={1000}
                fillOpacity={.5}
            />)
        }

        return venues;
    }

    render() {
        return (
            <div>
                <h1>Date: {MapContainer.getFormattedDate(this.state.selectedDate)}</h1>
                <Map google={this.props.google}
                     initialCenter={{
                         lat: 28.535043,
                         lng: -81.383314,
                     }}
                     style={{height: 'calc(100% - 3.5rem)', width: '100%'}}
                     zoom={14}>

                    {this.getParkingMarkers()}
                    {this.getVenueMarkers()}
                </Map>
            </div>
        );
    }

    getEventVenues(selectedDate) {
        const eventsURL = "https://event-parking-api.herokuapp.com/event/" + selectedDate.year() + "/" + (selectedDate.month() + 1) + "/" + selectedDate.date();
        axios.get(eventsURL).then((res) => {
            let venues = [];
            for (let i = 0; i < res.data.rows.length; ++i) {
                if (!_.some(venues, (value) => value === res.data.rows[i].venue)) {
                    venues.push(res.data.rows[i].venue);
                }
            }
            this.setState({eventVenues: venues});
        });
    }
}

export default GoogleApiWrapper({
    apiKey: (apiKey),
})(MapContainer)