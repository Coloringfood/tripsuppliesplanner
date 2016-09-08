import React, {Component} from 'react';
import template from './Items.rt';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ItemsResource from './../resources/ItemsResource';
require('./../assets/style.scss');

const ENTER_KEY = 13;

module.exports = React.createClass({
    displayName: 'Items',
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {edited: '', items: [], counter: 0};
    },

    componentDidMount() {
        this.getAllItems();
    },
    getAllItems(response) {
        console.log("response: " + response);
        this.setState({loaded: false, edited: ""});
        return ItemsResource.getAllItems().then(this.updateItems);
    },
    updateItems(newItems) {
        console.log("newItems: ", newItems);
        this.setState({items: newItems, loaded: true});
    },

    add() {
        if (this.state.edited.trim().length === 0) {
            return;
        }
        this.setState({loaded: false});
        return ItemsResource.addItem(this.state.edited.trim()).then(this.getAllItems)
    },
    remove(item) {
        this.setState({loaded: false});
        return ItemsResource.removeItem(item).then(this.getAllItems)
    },
    toggleChecked(index) {
        var item = this.state.items[index];
        item.done = !item.done;
        this.setState({loaded: false});
        return ItemsResource.updateItem(item).then(this.getAllItems)
    },
    getDone() {
        return _.filter(this.state.items, {done: true});
    },
    getPending() {
        return _.filter(this.state.items, (o) => !o.done);
    },
    inputKeyDown(e) {
        if (e.keyCode == ENTER_KEY) {
            e.preventDefault();
            this.add();
        }
    },
    render: template
});