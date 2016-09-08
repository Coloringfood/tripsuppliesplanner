var React = require('react'),
    Loader = require('react-loader');


var ItemsResource = require('./../resources/ItemsResource');
var Items = require('./../components/ItemsGenerator');

class ItemsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
        // TODO Find a way to get the items from API
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateItems = this.updateItems.bind(this);
        this.getAllItems = this.getAllItems.bind(this);
    }

    componentDidMount() {
        this.getAllItems();
    }

    handleSubmit(e) {
        console.log("handleSubmit");
        e.preventDefault();
        this.setState({loaded: false});
        var that = this;
        return ItemsResource.addItem(document.getElementById('newText').value).then((response) => {
            console.log(response);
            that.getAllItems();
        })
    }

    getAllItems() {
        console.log("getAllItems");
        this.setState({loaded: false});
        var that = this;
        return ItemsResource.getAllItems().then((response) => {
            console.log(response);
            that.updateItems(response);
        })
    }

    updateItems(newItems) {
        this.setState({items: newItems, loaded: true});
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
                        {'Add #' + (this.state.items.length + 1)}
                    </button>
                </form>

                <Loader loaded={this.state.loaded}>
                    <Items items={this.state.items}/>
                </Loader>
            </div>
        );
    }
}

module.exports = ItemsPage;