'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchTable = function (_Component) {
    _inherits(SearchTable, _Component);

    //Constructor
    function SearchTable(props) {
        _classCallCheck(this, SearchTable);

        var _this = _possibleConstructorReturn(this, (SearchTable.__proto__ || Object.getPrototypeOf(SearchTable)).call(this, props));

        _this.state = {
            //headers:this.props.headers,
            data: [],
            sortby: null,
            descending: false,
            edit: null,
            search: false
        };
        _this._preSearchData = null;
        return _this;
    }
    /*** 
        componentDidMount(){
            //请求在线接口
            var url = "http://127.0.0.1:8000/songs"
            var option = {
                methods:"get",
            }
            fetch(url,option).then((res)=>{
                return res.json()
            }).then((res)=>{
                // 请求到的数据
                console.log(res)
    
                ///
                var inputdata = [];
                var ary = res.music;
                for(var i = 0;i<ary.length;i++){
                    var tmp = [];
                    tmp.push(ary[i]["album"]);
                    tmp.push(ary[i]["genre"]);
                    tmp.push(ary[i]["artist"]);
                    tmp.push(ary[i]["year"]);
                    tmp.push(ary[i]["title"]);
                    inputdata.push(tmp);
                }
                ///
                // 修改state
                this.setState({
                    data:inputdata,
                })
                // 打印输出 
                console.log(this.state.data)
            })
        }
    */


    _createClass(SearchTable, [{
        key: '_sort',
        value: function _sort(e) {
            var column = e.target.cellIndex;
            var descending = this.state.sortby === column && !this.state.descending;
            var data = this.state.data.slice();
            data.sort(function (a, b) {
                return descending ? a[column] < b[column] ? 1 : -1 : a[column] > b[column] ? 1 : -1;
            });
            this.setState({
                data: data,
                descending: descending,
                sortby: column
            });
        }
    }, {
        key: '_showEditor',
        value: function _showEditor(e) {
            this.setState({ edit: {
                    row: parseInt(e.target.dataset.row, 10),
                    cell: e.target.cellIndex
                } });
        }
    }, {
        key: '_save',
        value: function _save(e) {
            e.preventDefault();
            var input = e.target.firstChild;
            var data = this.state.data.slice();
            data[this.state.edit.row][this.state.edit.cell] = input.value;
            this.setState({
                data: data,
                edit: null
            });
        }
    }, {
        key: '_download',
        value: function _download(format, ev) {
            var contents = format === 'json' ? JSON.stringify(this.state.data) : this.state.data.reduce(function (result, row) {
                return result + row.reduce(function (rowresult, cell, idx) {
                    return rowresult + '"' + cell.replace(/"/g, '""') + '"' + (idx < row.length - 1 ? ',' : '');
                }, '') + "\n";
            }, '');
            var URL = window.URL || window.webkitURL;
            var blob = new Blob([contents], { type: 'text/' + format });
            ev.target.href = URL.createObjectURL(blob);
            ev.target.download = 'data.' + format;
        }
    }, {
        key: '_toggleSearch',
        value: function _toggleSearch() {
            var _this2 = this;

            var url = "http://127.0.0.1:8000/songs";
            var option = {
                methods: "get"
            };
            fetch(url, option).then(function (res) {
                return res.json();
            }).then(function (res) {
                // 请求到的数据
                console.log(res);

                ///
                var inputdata = [];
                var ary = res.music;
                for (var i = 0; i < ary.length; i++) {
                    var tmp = [];
                    tmp.push(ary[i]["album"]);
                    tmp.push(ary[i]["genre"]);
                    tmp.push(ary[i]["artist"]);
                    tmp.push(ary[i]["year"]);
                    tmp.push(ary[i]["title"]);
                    inputdata.push(tmp);
                }
                ///
                // 修改state
                _this2.setState({
                    data: inputdata
                });
                // 打印输出 
                console.log(_this2.state.data);
            });
            ///
            if (this.state.search) {
                this.setState({
                    search: false,
                    data: this._preSearchData
                });
                this._preSearchData = null;
            } else {
                this._preSearchData = this.state.data;
                this.setState({
                    search: true
                });
            }
            /***
            if(this.state.search){
                this.setState({
                    search:false,
                    data:this.state._preSearchData
                });
                this.setState({
                    _preSearchData:null
                });
                
            }
            else{
                this.setState({
                    search:true,
                    _preSearchData:this.state.data
                });
            }
            ***/
        }
    }, {
        key: '_search',
        value: function _search(e) {

            var needle = e.target.value.toLowerCase();
            if (!needle) {
                this.setState({ data: this._preSearchData });
                return;
            }
            var idx = e.target.dataset.idx;
            //var idx = e.target.cellIndex;
            var searchdata = this._preSearchData.filter(function (row) {
                return row[idx].toString().toLowerCase().indexOf(needle) > -1;
            }, this);
            this.setState({ data: searchdata });
        }
    }, {
        key: '_renderSearch',
        value: function _renderSearch() {
            if (!this.state.search) {
                return null;
            }
            return _react2.default.createElement(
                'tr',
                { onChange: this._search.bind(this) },
                this.props.headers.map(function (_ignore, idx) {
                    return _react2.default.createElement(
                        'td',
                        { key: idx },
                        _react2.default.createElement('input', { type: 'text', 'data-idx': idx, className: 'input' + _ignore })
                    );
                }, this)
            );
        }

        //ToolBar main render

    }, {
        key: '_renderToolbar',
        value: function _renderToolbar() {
            return _react2.default.createElement(
                'div',
                { className: 'toolbar' },
                _react2.default.createElement(
                    'button',
                    { onClick: this._toggleSearch.bind(this), className: 'SearchButton' },
                    'Search'
                ),
                _react2.default.createElement(
                    'a',
                    { onClick: this._download.bind(this, 'json'), href: 'data.json', className: 'JsonButton' },
                    'Export JSON'
                ),
                _react2.default.createElement(
                    'a',
                    { onClick: this._download.bind(this, 'csv'), href: 'data.csv', className: 'CSVButton' },
                    'Export CSV'
                )
            );
        }

        //Table main render

    }, {
        key: '_renderTable',
        value: function _renderTable() {
            return _react2.default.createElement(
                'table',
                null,
                _react2.default.createElement(
                    'thead',
                    { onClick: this._sort.bind(this) },
                    _react2.default.createElement(
                        'tr',
                        null,
                        this.props.headers.map(function (title, idx) {
                            return _react2.default.createElement(
                                'th',
                                { key: idx, className: title },
                                this.state.sortby === idx ? this.state.descending ? title + '\u2191' : title + '\u2193' : title
                            );
                        }, this)
                    )
                ),
                _react2.default.createElement(
                    'tbody',
                    { onDoubleClick: this._showEditor.bind(this) },
                    this._renderSearch(),
                    this.state.data.map(function (row, rowidx) {
                        return _react2.default.createElement(
                            'tr',
                            { key: rowidx },
                            row.map(function (cell, idx) {
                                var content = cell;
                                var edit = this.state.edit;
                                if (edit && edit.row === rowidx && edit.cell === idx) {
                                    content = _react2.default.createElement(
                                        'form',
                                        { onSubmit: this._save },
                                        _react2.default.createElement('input', { type: 'text', defaultValue: cell })
                                    );
                                }
                                return _react2.default.createElement(
                                    'td',
                                    { key: idx, 'data-row': rowidx },
                                    content
                                );
                            }, this)
                        );
                    }, this)
                )
            );
        }

        //Main render

    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'SearchTable' },
                this._renderToolbar(),
                this._renderTable()
            );
        }
    }]);

    return SearchTable;
}(_react.Component);

SearchTable.propTypes = {
    headers: _propTypes2.default.arrayOf(_propTypes2.default.string)
};
exports.default = SearchTable;