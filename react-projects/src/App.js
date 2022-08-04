import React, { Component } from 'react';

import Recent from './components/recent';
import Alltime from './components/alltime';
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
  }

  render() {
    var show = null;
    if(this.state.alltime){
      show = <Alltime  data={this.state.data}/>;
    }else{
      show = <Recent data={this.state.data}/>;
    }

    return (
      <div className="App">
          <button onClick={this.handleDisplay.bind(this)}>View {this.state.view}</button>
          {show}
      </div>
    );
  }
}

export default App;
