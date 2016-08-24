var React = require('react');

class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    render() {
        var test = 0;
        return (
            <div className="container">
                <h3>ITEMS PAGE</h3>
                <div>Props:</div>
                <div>{test}</div>
            </div>
        );
    }
}

module.exports = ItemsPage;