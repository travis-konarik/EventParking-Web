import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';
import React, {Component} from 'react';
import config from './config';

export class MapContainer extends Component {
    getFormattedDate() {
        let m = this.props.selectedDate;
        let out = 'No Date';

        if (m) {
            out = m.format('MMM D, YYYY');
        }

        return out;
    }

    render() {
        return (
            <div>
                <h1>Date: {this.getFormattedDate()}</h1>
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
            </div>
        );
    }
}


export default GoogleApiWrapper({
    apiKey: (config.apiKey),
})(MapContainer)