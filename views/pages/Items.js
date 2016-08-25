var React = require('react');
var Items = require('./../components/ItemsGenerator');

class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
        this.update = this.update.bind(this);
        this.items = [
            "Test",
            "Again"
        ]
    }

    update(e) {

    }

    render() {
        var test = 0;
        return (
            <div className="col-lg-12">
                <h3>ITEMS PAGE</h3>
                <Items items={this.items} />
            </div>
        );
    }
}

module.exports = ItemsPage;