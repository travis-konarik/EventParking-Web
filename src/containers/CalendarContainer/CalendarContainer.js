import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';
import Spinner from 'react-spinkit';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import _ from 'underscore';


export default class CalendarContainer extends Component {
    formats = {
        dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd M/D', culture),
    };

    monthsRetrieved = [];

    constructor() {
        super();
        this.state = {
            events: [],
            isParking: false,
            isLoaded: false,
            selectedDay: null,
        };
        BigCalendar.momentLocalizer(moment);
        this.componentWillUpdate = this.stateWillUpdate.bind(this);
    }

    componentDidMount() {
        this.getEvents(moment().month());
        this.getEvents();

        let nextMonth = moment().month() + 2;
        if (nextMonth > 11) {
            this.getEvents(1, moment().year());
        } else {
            this.getEvents(nextMonth);
        }
    }

    getEvents(month = moment().month() + 1, year = moment().year()) {
        let found = false;
        for (let i = 0; i < this.monthsRetrieved.length; ++i) {
            if (this.monthsRetrieved[i].month === month && this.monthsRetrieved[i].year === year) {
                found = true;
                break;
            }
        }
        if (!found) {
            const eventsURL = "https://event-parking-api.herokuapp.com/event/" + year + "/" + month;
            axios.get(eventsURL).then((res) => {
                this.setState({events: [...this.state.events, ...CalendarContainer.formatRows(res.data.rows)]});
                // this.setParkingState(res.data.rows);
                this.setState({isLoaded: true});
            });
            this.monthsRetrieved.push({month: month, year: year});
        }
    }

    newDateSelected(a) {
        const m = moment(a);
        this.getEvents(m.month() + 2, m.year());
    }

    render() {
        let parkingMessage = null, calendar = null;
        if (this.state.isLoaded) {
            calendar = <BigCalendar
                events={this.state.events}
                agenda={false}
                defaultView='month'
                views={['month', 'week', 'day']}
                onNavigate={this.newDateSelected.bind(this)}
                onSelectEvent={this.eventSelected.bind(this)}
                formats={this.formats}
            />;
            if (this.state.isParking) {
                parkingMessage =
                    <h2 style={{textAlign: "center", margin: "20px 0 20px 0", flexGrow: '1'}}>YES! There is Event
                                                                                              Parking Today!</h2>
            }
            else {
                parkingMessage =
                    <h2 style={{textAlign: "center", margin: "20px 0 20px 0", flexGrow: '1'}}>There is no Event Parking
                                                                                              today.</h2>
            }
        } else {
            parkingMessage = <h2 style={{textAlign: "center", margin: "20px 0 20px 0"}}>Loading...</h2>;
            calendar = <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "300px"}}>
                <Spinner name="ball-spin-fade-loader"/>
            </div>
        }
        return (
            <div style={{flexGrow: '1', display: 'flex', flexDirection: 'column', width: '100%'}}>
                {parkingMessage}
                {calendar}
            </div>
        );
    }

    static formatRows(rows) {
        _.each(rows, (row) => {
            row['start'] = new Date(row.start_date);
            row['end'] = new Date(row.end_date);

        });
        return rows;
    }

    eventSelected(event) {
        let win = window.open(event.url, '_blank');
        win.focus();
        console.log(event);
    }

    stateWillUpdate(nextProps, nextState) {
        if (nextState.events !== this.state.events) {
            this.setParkingState(nextState.events);
        }
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

