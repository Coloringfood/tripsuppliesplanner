import React, {Component} from 'react';
import template from './Items.rt';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import ItemsResource from './../resources/ItemsResource';
require('./../assets/style.scss');

const ENTER_KEY = 13;

module.exports = React.createClass({
    displayName: 'Todo',
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {edited: '', items: [], counter: 0};
    },

    componentDidMount() {
        this.getAllItems();
    },
    getAllItems() {
        console.log("getAllItems");
        this.setState({loaded: false});
        var that = this;
        return ItemsResource.getAllItems().then((response) => {
            console.log(response);
            that.updateItems(response);
        })
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
        var that = this;
        return ItemsResource.addItem(this.state.edited.trim()).then((response) => {
            console.log(response);
            that.setState({edited: ""});
            that.getAllItems();
        })
    },
    remove(item) {
        this.setState({items: _.reject(this.state.items, item)});
    },
    toggleChecked(index) {
        var items = _.cloneDeep(this.state.items);
        items[index].done = !items[index].done;
        this.setState({items: items});
    },
    clearDone() {
        this.setState({items: this.getPending()});
    },
    getDone() {
        return _.filter(this.state.items, {done: true});
    },
    getPending() {
        return _.filter(this.state.items, {done: false});
    },
    countTodos(done) {
        return _.filter(this.state.items, {done: done}).length;
    },
    inputKeyDown(e) {
        if (e.keyCode == ENTER_KEY) {
            e.preventDefault();
            this.add();
        }
    },
    render: template
});