'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var ExampleApplication = React.createClass({
  render: function() {
    return <p>Yo</p>;
  }
});

ReactDOM.render(
  <ExampleApplication />,
  document.getElementById('container')
);
