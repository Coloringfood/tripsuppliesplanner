var React = require('react');

class PackingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
        this.update = this.update.bind(this);
    }

    update(e) {

    }

    render() {
        return (
            <div className="">
                <h3>Packing PAGE</h3>
            </div>
        );
    }
}

module.exports = PackingPage;