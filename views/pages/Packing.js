var React = require('react');

class PackingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }
    render() {
        return (
            <div className="container">
                <h3>Packing PAGE</h3>
                <div>Props:</div>
                <div>{this.state}</div>
            </div>
        );
    }
}

module.exports = PackingPage;