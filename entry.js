require("./style.css");

var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var $ = require('jquery');

var Comment = React.createClass({
    propTypes: {
        children: React.PropTypes.node,
        author: React.PropTypes.string
    },
    rawMarkup: function() {
        var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
        return { __html: rawMarkup };
    },
    render: function() {
        return (
            <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
        );
    }
});

var CommentList = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
    },
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
            );
        });
        return (
            <div className="commentList">
        {commentNodes}
      </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function() {
        return (
            <form className="commentForm">
        <input type="text" placeholder="Your name" />
        <input type="text" placeholder="Say something..." />
        <input type="submit" value="Post" />
      </form>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({ data: data });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return { data: [] };
    },
    propTypes: {
        url: React.PropTypes.string,
        pollInterval: React.PropTypes.number
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
        );
    }
});

ReactDOM.render(
    <CommentBox url="/data.json" pollInterval={2000}/>,
    document.getElementById('app')
);
