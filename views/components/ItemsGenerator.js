var React = require('react');

class Item extends React.Component {
    render() {
        var i = -1;
        var createRow = function (itemText) {
            console.log("itemText: ", itemText);
            return (
                <tr key={++i}>
                    <th>{i}</th>
                    <td>{itemText.value}</td>
                </tr>
            );
        };
        return (
            <table className="table table-bordered table-hover">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {this.props.items.map(createRow)}
                </tbody>
            </table>
        );
    }
}


module.exports = Item;