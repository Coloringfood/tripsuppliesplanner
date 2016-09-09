import * as React from 'react';
import * as Loader from 'react-loader';
import * as _ from 'lodash';


var ItemsResource = require('./../resources/ItemsResource');
class ItemsList extends React.Component {
    render() {
        var createRow = function (item) {
            return (
                <tr key={item._id}>
                    <th>{item._id}</th>
                    <td>{item.value}</td>
                    <td>{item.categories}</td>
                    <td>{item.uses}</td>
                </tr>
            );
        };
        return (
            <table className="table table-bordered table-hover">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Categories</th>
                    <th>Uses</th>
                </tr>
                </thead>
                <tbody>
                {_.map(this.props.items, createRow.bind(this))}
                </tbody>
            </table>
        );
    }
}

module.exports = React.createClass({
    displayName: 'ItemsPage',
    getInitialState() {
        return {items: [], categories: [], uses: []};
    },
    componentDidMount() {
        this.getAllItems();
    },
    handleSubmit(e) {
        console.log("handleSubmit");
        e.preventDefault();
        this.setState({loaded: false});
        var that = this;
        return ItemsResource.addItem(document.getElementById('newText').value).then((response) => {
            console.log(response);
            that.getAllItems();
        })
    },
    getAllItems() {
        console.log("getAllItems");
        this.setState({loaded: false});
        var that = this;
        return ItemsResource.getAllItems().then((response) => {
            console.log(response);
            that.updateItems(response);
        })
    },
    updateItems(newItems) {
        function getUnique(Items, property){
            var uniqueArray = [];
            var itemsLength = Items.length;
            for (var i = 0; i < itemsLength; i++) {
                var item = Items[i];
                uniqueArray = _.union(categories, item[property]);
            }
            return uniqueArray;
        }
        var categories = getUnique(newItems, "categories");
        var uses = getUnique(newItems, "uses");
        this.setState({items: newItems, loaded: true, categories: categories, uses: uses});
    },
    render() {
        return (
            <div className="col-lg-12">
                <h3>ITEMS PAGE</h3>
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input id="newText" type="text" className="form-control" placeholder="New Item Name"/>
                        &nbsp;
                    </div>
                    <button className="btn btn-primary">
                        {'Add Item'}
                    </button>
                </form>
                {/*<Loader loaded={this.state.loaded}>*/}
                    <ItemsList items={this.state.items}/>
                {/*</Loader>*/}
            </div>
        );
    }
});