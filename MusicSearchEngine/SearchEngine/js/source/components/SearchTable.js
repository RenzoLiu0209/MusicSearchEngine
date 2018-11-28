import React,{Component}from 'react';
import PropTypes from 'prop-types';


class SearchTable extends Component{

    //Constructor
    constructor(props){
        super(props);
        this.state={
            //headers:this.props.headers,
            data:[],
            sortby:null,
            descending:false,
            edit:null,
            search:false,
        };
        this._preSearchData = null;
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
    _sort(e){
        var column = e.target.cellIndex;
        var descending = this.state.sortby===column&&!this.state.descending;
        var data = this.state.data.slice();
        data.sort(function(a,b){
            return descending?
            a[column]<b[column]?1:-1
            :a[column]>b[column]?1:-1;
        });
        this.setState({
            data:data,
            descending:descending,
            sortby:column
        });
    }


    _showEditor(e){
        this.setState({edit:{
            row:parseInt(e.target.dataset.row,10),
            cell:e.target.cellIndex,
        }});
    }


    _save(e){
        e.preventDefault();
        var input = e.target.firstChild;
        var data = this.state.data.slice();
        data[this.state.edit.row][this.state.edit.cell] = input.value;
        this.setState({
            data:data,
            edit:null,
        });
    }


    _download(format, ev) {
        var contents = format === 'json'
        ? JSON.stringify(this.state.data)
        : this.state.data.reduce(function(result, row) {
            return result
                    + row.reduce(function(rowresult, cell, idx) {
                        return rowresult
                                + '"'
                                + cell.replace(/"/g, '""')
                                + '"'
                                + (idx < row.length - 1 ? ',' : '');
                        }, '')
                    + "\n";
        }, '');
        var URL = window.URL || window.webkitURL;
        var blob = new Blob([contents], {type: 'text/' + format});
        ev.target.href = URL.createObjectURL(blob);
        ev.target.download = 'data.' + format;
    }


    _toggleSearch(){

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
        ///
        if(this.state.search){
            this.setState({
                search:false,
                data:this._preSearchData
            });
            this._preSearchData = null;
        }
        else{
            this._preSearchData=this.state.data;
            this.setState({
                search:true,
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


    _search(e){

        var needle = e.target.value.toLowerCase();
        if(!needle){
            this.setState({data:this._preSearchData});
            return;
        }
        var idx = e.target.dataset.idx;
        //var idx = e.target.cellIndex;
        var searchdata = this._preSearchData.filter(function(row){
            return row[idx].toString().toLowerCase().indexOf(needle)>-1;
        },this);
        this.setState({data:searchdata});
    }


    _renderSearch(){
        if(!this.state.search){
            return null;
        }
        return(
            <tr onChange={this._search.bind(this)}>
                {this.props.headers.map(function(_ignore,idx){
                    return(<td key={idx}>
                        <input type='text' data-idx={idx} className={'input'+_ignore}/>
                    </td>);
                },this)}
            </tr>
        );
    }


    //ToolBar main render
    _renderToolbar(){
        return(
            <div className='toolbar'>
                <button onClick={this._toggleSearch.bind(this)} className='SearchButton'>
                Search
                </button>
                <a onClick={this._download.bind(this,'json')} href='data.json' className='JsonButton'>
                Export JSON
                </a>
                <a onClick={this._download.bind(this,'csv')} href='data.csv' className='CSVButton'>
                Export CSV
                </a>
            </div>
        );
    }


    //Table main render
    _renderTable(){
        return(
            <table>
                <thead onClick={this._sort.bind(this)}>
                    <tr>
                        {this.props.headers.map(function(title,idx){
                            return (<th key={idx} className={title}>{
                                this.state.sortby === idx?
                                this.state.descending?
                                title+'\u2191':title+'\u2193'
                                :title
                            }</th>);
                        },this)}
                    </tr>
                </thead>
                <tbody onDoubleClick={this._showEditor.bind(this)}>
                    {this._renderSearch()}
                    {this.state.data.map(function(row,rowidx){
                        return (<tr key={rowidx}>{
                            row.map(function(cell,idx){
                                var content = cell;
                                var edit = this.state.edit;
                                if(edit&&edit.row===rowidx&&edit.cell===idx){
                                    content = (
                                        <form onSubmit={this._save}>
                                            <input type='text' defaultValue={cell}/>
                                        </form>
                                    );
                                }
                                return <td key={idx} data-row={rowidx}>{content}</td>;
                            },this)}
                        </tr>);
                    },this)}
                </tbody>
            </table>
        );
    }


    //Main render
    render(){
        return(
            <div className="SearchTable">
                {this._renderToolbar()}
                {this._renderTable()}
            </div>
        );
    }
}

SearchTable.propTypes={
    headers:PropTypes.arrayOf(
        PropTypes.string
    ),
};
export default SearchTable
