import React, {Component} from 'react';
import template from './NavBar.rt';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

module.exports = React.createClass({
    displayName: 'NavBar',
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {
            pages: [
                "todo",
                "items",
                'packing',
                'nothing'
            ]
        };
    },
    navigate(page) {
        console.log("Navigating to: " + page);
        console.log("this.props.customProp: " + this.props.customProp);
        console.log(typeof this.props.customProp);
        this.props.customProp();
    },
    isActive(page) {
        return page == this.props.curLocation ? "Active" : "";
    },
    render: template
});