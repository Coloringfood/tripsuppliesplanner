var React = require('react');

class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }
    render() {
        return (
            <div className="container">
                <h3>ITEMS PAGE</h3>
                <div>Props:</div>
                <div>{this.state}</div>
            </div>
        );
    }
}

module.exports = ItemsPage;