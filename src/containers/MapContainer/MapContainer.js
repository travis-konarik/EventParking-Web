import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';
import React, {Component} from 'react';
import config from './config';

const LoadingContainer = (props) => (
    <div>Fancy loading container!</div>
);

export class MapContainer extends Component {
    render() {
        return (
            <Map google={this.props.google}
                 initialCenter={{
                     lat: 28.535043,
                     lng: -81.383314,
                 }}
                 zoom={14}>

                <Marker
                    // onClick={this.onMarkerClick}
                    name={'Current location'}/>

                <InfoWindow
                    // onClose={this.onInfoWindowClose}
                >
                    <div>
                        <h1>
                            {/*{this.state.selectedPlace.name}*/}
                        </h1>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}


export default GoogleApiWrapper({
    apiKey: (config.apiKey),
    LoadingContainer: LoadingContainer,
})(MapContainer)