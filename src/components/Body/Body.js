import React, {Component} from 'react';
import CalendarContainer from '../../containers/CalendarContainer';
import MapContainer from '../../containers/MapContainer';


export default class Body extends Component {
    mainScrollStyle = {textAlign: 'center'};
    mainContentStyle = {flexGrow: '1', position: 'relative', overflow: 'hidden'};
    mainWrapperStyle = {display: 'flex', flexDirection: 'column', flexGrow: '1'};

    constructor() {
        super();
        this.state = {
            slideShowing: 0,
            containerCount: 2,
            isCalendarContainerHidden: false,
            isMapContainerHidden: true,
        };
    }

    upClicked () {
        if (this.state.slideShowing > 0) {
             let newSlide = --this.state.slideShowing;

            this.setState({slideShowing: newSlide});
            this.setShowingSlide(newSlide);
        }
    }

    downClicked () {
        if (this.state.slideShowing < this.state.containerCount - 1) {
            let newSlide = ++this.state.slideShowing;
            this.setState({slideShowing: newSlide});
            this.setShowingSlide(newSlide);
        }
    }

    setShowingSlide(slideNumber) {
        switch (slideNumber) {
            case 1:
                this.setState({isMapContainerHidden: false, isCalendarContainerHidden: true});
                break;
            case 0:
            default:
                this.setState({isMapContainerHidden: true, isCalendarContainerHidden: false});
                break;
        }
    }

    render() {
        return (
            <div style={this.mainWrapperStyle}>
                <div style={this.mainScrollStyle} onClick={this.upClicked.bind(this)} id={'mainScrollUp'}>Scroll up to see previous content
                </div>
                <div style={this.mainContentStyle}>
                    {!this.state.isCalendarContainerHidden && <CalendarContainer/>}
                    {!this.state.isMapContainerHidden && <MapContainer/>}
                </div>
                <div style={this.mainScrollStyle} onClick={this.downClicked.bind(this)} id={'mainScrollDown'}>Scroll down to see next
                                                                                         content
                </div>
            </div>
        );
    };
}
