var React = require('react');
var Items = require('./../components/ItemsGenerator');

class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props
        // TODO Find a way to get the items from API
        this.items = [
            "Test",
            "Again"
        ];
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(e) {
        // TODO Make API Call to add element
    }


    render() {
        return (
            <div className="col-lg-12">
                <h3>ITEMS PAGE</h3>
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input id="newText" type="text" className="form-control" placeholder="Write task"/>
                        &nbsp;
                    </div>
                    <button className="btn btn-primary">
                        {'Add #' + (this.items.length + 1)}
                    </button>
                </form>
                <Items items={this.items}/>
            </div>
        );
    }
}

module.exports = ItemsPage;