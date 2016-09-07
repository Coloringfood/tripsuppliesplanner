var React = require('react');

class Item extends React.Component {
    render() {
        var i = -1;
        var createRow = function (item) {
            return (
                <tr key={++i}>
                    <th>{item._id}</th>
                    <td>{item.value}</td>
                    <td>{item.status}</td>
                </tr>
            );
        };
        return (
            <table className="table table-bordered table-hover">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Status</th>
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