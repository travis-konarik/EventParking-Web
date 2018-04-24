import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import Spinner from 'react-spinkit';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import _ from 'underscore';


export default class CalendarContainer extends Component {
    constructor() {
        super();
        this.state = {
            dates: [],
            events: [],
            isParking: false,
            isLoaded: false,
        };
        BigCalendar.momentLocalizer(moment);
    }

    componentDidMount() {
        const eventsURL = "https://event-parking-api.herokuapp.com/event/2018/4";
        axios.get(eventsURL).then((res) => {
            this.setState({events: CalendarContainer.formatRows(res.data.rows)});
            this.setParkingState(res.data.rows);
            this.setState({isLoaded: true});
        })
    }

    render() {
        let parkingMessage = null, calendar = null;
        if (this.state.isLoaded) {
            calendar = <BigCalendar
                events={this.state.events}
                views={{
                    'month': true,
                    'agenda': false,
                    'week': false,
                    'day': false,
                    'work_week': false
                }}
                toolbar={false}
            />;
            if (this.state.isParking) {
                parkingMessage =
                    <h2 style={{textAlign: "center", margin: "20px 0 20px 0"}}>YES! There is Event Parking Today!</h2>
            }
            else {
                parkingMessage =
                    <h2 style={{textAlign: "center", margin: "20px 0 20px 0"}}>There is no Event Parking today.</h2>
            }
        } else {
            parkingMessage = <h2 style={{textAlign: "center", margin: "20px 0 20px 0"}}>Loading...</h2>;
            calendar = <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "300px"}}>
                <Spinner name="ball-spin-fade-loader"/>
            </div>
        }
        return (
            <div>
                {parkingMessage}
                {calendar}
            </div>
        );
    }

    static formatRows(rows) {
        _.each(rows, (row) => {
            row['start'] = row.start_date;
            row['end'] = row.end_date;

        });
        return rows;
    }

    setParkingState(events) {
        this.setState({
            isParking: _.some(events, (event) => {
                return moment().isSame(event.start, 'day') ||
                    moment().isSame(event.end, 'day');
            })
        });

    }
}

