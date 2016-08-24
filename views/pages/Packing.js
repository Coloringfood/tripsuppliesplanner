var React = require('react');

class PackingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    render() {
        var test = 0;
        return (
            <div className="container">
                <h3>Packing PAGE</h3>
                <div>Props:</div>
                <div>{test}</div>
            </div>
        );
    }
}

module.exports = PackingPage;