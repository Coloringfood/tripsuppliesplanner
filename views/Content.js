var React = require('react');
var ReactDOM = require('react-dom');

var NavBar = require('./NavBar');
var ItemsPage = require('./pages/Items');
var PackingPage = require('./pages/Packing');
var TodoPage = require('./pages/Todo');


class RenderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    render() {
        var items = [
            'document your code',
            'drop the kids off at the pool',
            '</script><script>alert(666)</script>'
        ];

        var page = <div>Nothing to see</div>;
        if (this.state.page == "items") {
            page = <ItemsPage items={items}/>
        } else if (this.state.page == "todo") {
            page = <TodoPage txt="Space" items={items}/>;
        } else if (this.state.page == "packing") {
            page = <PackingPage/>;
        }

        return page;
    }
}

class PlannerApp extends React.Component {
    constructor(props) {
        super(props);
        this.onNavClick = this.onNavClick.bind(this);
        this.changePage = this.changePage.bind(this);
        this.curLocation = "items";
    }

    componentDidMount() {
        this.changePage();
    }

    onNavClick(e) {
        this.curLocation = e.target.innerHTML;
        this.changePage();
    }

    changePage() {
        if (typeof window !== 'undefined') {
            var pageNode = document.getElementById("pageContent");
            ReactDOM.unmountComponentAtNode(pageNode);
            ReactDOM.render(<RenderPage page={this.curLocation} globals={this.globals}/>, pageNode);

            var navNode = document.getElementById("nav");
            ReactDOM.unmountComponentAtNode(navNode);
            ReactDOM.render(<NavBar curLocation={this.curLocation} onNavClick={this.onNavClick}/>, navNode);
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row" id="nav"></div>
                <div className="row"><h3>{this.curLocation}</h3></div>
                <div className="row" id="pageContent"></div>
            </div>
        );
    }
}

module.exports = PlannerApp;