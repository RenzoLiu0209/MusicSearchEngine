'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './components/Logo';
import SearchTable from './components/SearchTable';

var headers = localStorage.getItem('headers');
//var data = localStorage.getItem('data');
if(!headers){
  headers = ['album','genre','artist','year','title'];
//  data = [['Test','2015','3','meh'],['Addc','2017','6','aah']];
}

ReactDOM.render(
  <div>
    <h1>
      <Logo/> Music Search Engine
    </h1>
    <SearchTable headers={headers}/>
  </div>,
  document.getElementById('app')
);
//initialData={data}
