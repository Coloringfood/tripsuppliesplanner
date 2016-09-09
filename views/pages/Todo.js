import React, {Component} from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import * as _ from 'lodash';

const ENTER_KEY = 13;

module.exports = React.createClass({
    displayName: 'Todo',
    mixins: [LinkedStateMixin],
    getInitialState() {
        return {edited: '', todos: [], counter: 0};
    },
    add() {
        if (this.state.edited.trim().length === 0) {
            return;
        }
        var newTodo = {value: this.state.edited, done: false, key: this.state.counter};
        this.setState({todos: this.state.todos.concat(newTodo), edited: '', counter: this.state.counter + 1});
    },
    remove(todo) {
        this.setState({todos: _.reject(this.state.todos, todo)});
    },
    toggleChecked(index) {
        var todos = _.cloneDeep(this.state.todos);
        todos[index].done = !todos[index].done;
        this.setState({todos: todos});
    },
    clearDone() {
        this.setState({todos: this.getPending()});
    },
    getDone() {
        return _.filter(this.state.todos, {done: true});
    },
    getPending() {
        return _.filter(this.state.todos, {done: false});
    },
    countTodos(done) {
        return _.filter(this.state.todos, {done: done}).length;
    },
    inputKeyDown(e) {
        if (e.keyCode == ENTER_KEY) {
            e.preventDefault();
            this.add();
        }
    },
    onChange(e) {
        this.setState({edited: e.target.value});
    },
    render() {
        function repeatItem1(todo, itemIndex) {
            // return React.createElement('li', {}, item);
            var completed = todo.done ? "done":"";
            return (
                <div className="todo-item" key={todo.key}>
                    <img src="src/assets/delete.png"
                         onClick={()=>this.remove(todo)}
                         title="Remove Todo"/>
                    <input type="checkbox" checked={todo.done} onChange={()=>this.toggleChecked(todoIndex)}/>
                    <span className={completed}>{todo.value}</span>
                </div>
            )
        }
        return (
            <div>
                <strong>{this.getDone().length}</strong> done,
                <strong>{this.getPending().length}</strong> pending
                <br/>
                {_.map(this.state.todos, repeatItem1.bind(this))}
                <input key="myinput" className="new-todo" placeholder="What needs to be done?" type="text"
                       onKeyDown={this.inputKeyDown} value={this.state.edited}
                       onChange={this.onChange}/>
                <button onClick={this.add}>Add</button>
                <br/>
                <button onClick={this.clearDone}>Clear done</button>
            </div>
        )
    }
});