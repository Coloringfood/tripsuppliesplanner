var React = require('react');
var ReactDOM = require('react-dom');

var NavBar = require('./NavBar');
var ItemsPage = require('./pages/Items');
var PackingPage = require('./pages/Packing');
var TodoPage = require('./pages/Todo');


class RenderPage extends React.Component {
    constructor(props) {
        super(props);
        this.page = props.page;
    }

    render() {
        console.log("Rendering New Page");
        var items = [
            'document your code',
            'drop the kids off at the pool',
            '</script><script>alert(666)</script>'
        ];

        var page = <div>Nothing to see</div>;
        if (this.page == "items") {
            page = <ItemsPage />
        } else if (this.page == "todo") {
            page = <TodoPage txt="Space" items={items}/>;
        } else if (this.page == "packing") {
            page = <PackingPage />;
        }

        return page;
    }
}

class PlannerApp extends React.Component {
    constructor(props) {
        super(props);
        this.onNavClick = this.onNavClick.bind(this);
        this.curLocation = "todo";
    }

    componentDidMount() {
        this.changePage();
    }

    onNavClick(e) {
        this.curLocation = e.target.innerHTML;
        this.changePage();
    }

    changePage() {
        console.log(this.curLocation);
        if (typeof window !== 'undefined') {
            var pageNode = document.getElementById("pageContent");
            ReactDOM.unmountComponentAtNode(pageNode);
            ReactDOM.render(<RenderPage page={this.curLocation}/>, pageNode);

            var navNode = document.getElementById("nav");
            ReactDOM.unmountComponentAtNode(navNode);
            ReactDOM.render(<NavBar curLocation={this.curLocation} onNavClick={this.onNavClick}/>, navNode);
        }
    }

    render() {
        console.log("rendering");
        return (
            <div className="container">
                <div id="nav"></div>
                <h3>{this.curLocation}</h3>
                <div id="pageContent"></div>
            </div>
        );
    }
}

module.exports = PlannerApp;