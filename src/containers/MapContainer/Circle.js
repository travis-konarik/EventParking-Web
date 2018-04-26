import React from 'react'
import PropTypes from 'prop-types'

export const camelize = function (str) {
    return str.split(' ').map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
};

const evtNames = [
    'center_changed',
    'click',
    'dblclick',
    'drag',
    'dragend',
    'dragstart',
    'mousedown',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'radius_changed',
    'rightclick',
];

const wrappedPromise = function () {
    let wrappedPromise = {},
        promise = new Promise(function (resolve, reject) {
            wrappedPromise.resolve = resolve;
            wrappedPromise.reject = reject;
        });
    wrappedPromise.then = promise.then.bind(promise);
    wrappedPromise.catch = promise.catch.bind(promise);
    wrappedPromise.promise = promise;

    return wrappedPromise;
};

export class Circle extends React.Component {

    componentDidMount() {
        this.circlePromise = wrappedPromise();
        this.renderCircle();
    }

    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) ||
            (this.props.position !== prevProps.position) ||
            (this.props.icon !== prevProps.icon)) {
            if (this.circle) {
                this.circle.setMap(null);
            }
            this.renderCircle();
        }
    }

    componentWillUnmount() {
        if (this.circle) {
            this.circle.setMap(null);
        }
    }

    renderCircle() {
        const {
            map,
            google,
            position,
            mapCenter,
            draggable,
            radius,
            strokeColor,
            strokeOpacity,
            strokeWeight,
            fillColor,
            fillOpacity,
            ...props
        } = this.props;
        if (!google) {
            return null
        }

        let pos = position || mapCenter;
        let rad = radius ? radius : 100;
        let strkClr = strokeColor ? strokeColor : '#00000000';
        let strkOp = strokeOpacity ? strokeOpacity : 1;
        let strkWt = strokeWeight ? strokeWeight : 1;
        let fillClr = fillColor ? fillColor : '#FF0000';
        let fillOp = fillOpacity ? fillOpacity : 1;

        if (!(pos instanceof google.maps.LatLng)) {
            pos = new google.maps.LatLng(pos.lat, pos.lng);
        }

        const pref = {
            map,
            center: pos,
            draggable,
            radius: rad,
            strokeColor: strkClr,
            strokeOpacity: strkOp,
            strokeWeight: strkWt,
            fillColor: fillClr,
            fillOpacity: fillOp,
            ...props
        };
        this.circle = new google.maps.Circle(pref);

        evtNames.forEach(e => {
            this.circle.addListener(e, this.handleEvent(e));
        });

        this.circlePromise.resolve(this.circle);
    }

    getCircle() {
        return this.circlePromise;
    }

    handleEvent(evt) {
        return (e) => {
            const evtName = `on${camelize(evt)}`;
            if (this.props[evtName]) {
                this.props[evtName](this.props, this.circle, e);
            }
        }
    }

    render() {
        return null;
    }
}

Circle.propTypes = {
    position: PropTypes.object,
    map: PropTypes.object,
    strokeColor: PropTypes.string,
    strokeOpacity: PropTypes.number,
    strokeWeight: PropTypes.number,
    fillColor: PropTypes.string,
    fillOpacity: PropTypes.number,
};

evtNames.forEach(e => Circle.propTypes[e] = PropTypes.func);

Circle.defaultProps = {
    name: 'Circle'
};

export default Circle