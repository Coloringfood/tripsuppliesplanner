var React = require('react');
var NavBar = require('./NavBar');
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
            page = <button />
        } else if (this.page == "todo") {
            page = <TodoPage txt="Space" items={items}/>;
        }

        return page;
    }
}

class PlannerApp extends React.Component {
    constructor(props) {
        super(props);
        this.onNavClick = this.onNavClick.bind(this);
        this.curLocation = "todo";
        this.changePage();
    }

    onNavClick(e) {
        this.curLocation = e.target.innerHTML;
        this.changePage();
    }

    changePage() {
        console.log(this.curLocation);
        this.page = <RenderPage page={this.curLocation}/>
    }

    render() {
        return (
            <div className="container">
                <NavBar curLocation={this.curLocation} onNavClick={this.onNavClick}/>
                <h3>{this.curLocation}</h3>
                {this.page}
            </div>
        );
    }
}

module.exports = PlannerApp;