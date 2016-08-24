var React = require('react');

class Item extends React.Component {
    render() {
        var i = 0;
        var createItem = function(itemText) {
            return <li key={i++}>{itemText}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
}


module.exports = Item;