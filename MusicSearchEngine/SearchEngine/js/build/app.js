'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Logo = require('./components/Logo');

var _Logo2 = _interopRequireDefault(_Logo);

var _SearchTable = require('./components/SearchTable');

var _SearchTable2 = _interopRequireDefault(_SearchTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headers = localStorage.getItem('headers');
//var data = localStorage.getItem('data');
if (!headers) {
  headers = ['album', 'genre', 'artist', 'year', 'title'];
  //  data = [['Test','2015','3','meh'],['Addc','2017','6','aah']];
}

_reactDom2.default.render(_react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(
    'h1',
    null,
    _react2.default.createElement(_Logo2.default, null),
    ' Music Search Engine'
  ),
  _react2.default.createElement(_SearchTable2.default, { headers: headers })
), document.getElementById('app'));
//initialData={data}