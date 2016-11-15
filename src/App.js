import React, { Component } from 'react';

import Table from './components/table';
import './App.css';

class App extends Component {
  constructor(props) {
    super();
    this.state = { 
      alltime: true,
      view: 'Recent',
      url: 'alltime.json',
      data: null
    };
  }

  handleDisplay(){
    this.setState({
      alltime: !this.state.alltime,
      view: this.state.alltime ? 'Alltime' : 'Recent',
      url: this.state.alltime ? 'alltime.json' : 'recent.json'
    });
    this.getData();
  }

  componentWillMount() {
    this.getData();
  }

  getData() {
    
     var xhr = new XMLHttpRequest();
      xhr.open('GET', this.state.url);
      xhr.onreadystatechange = ()=>{
        if(xhr.readyState === 4 && xhr.status === 200){
          var informations = JSON.parse(xhr.responseText);
          this.setState({
            data : informations
          });
        }
      }
      xhr.send(null);    
  }

  render() {
    

    return (
      <div className="App">
          <button onClick={this.handleDisplay.bind(this)}>View {this.state.view}</button>
          <Table view={this.state.view} data={this.state.data}/>
      </div>
    );
  }
}

export default App;
