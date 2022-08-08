import React, { Component } from 'react';

export default class Alltime extends Component {
	constructor(props){
		super()
		this.state = {};
	}

	componentWillMount() {
    
     var xhr = new XMLHttpRequest();
      xhr.open('GET', 'alltime.json');
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

	render(){
		var temporaire = this.state.data;
	      var campers = temporaire ? temporaire.map((camper, i) => {
	        return (
	            <tr key={i}>
	              <td className="mdl-data-table__cell--non-numeric">{i+1}</td>
	              <td className="mdl-data-table__cell--non-numeric">{camper.username}</td>
	              <td className="mdl-data-table__cell--non-numeric">{camper.recent}</td>
	              <td className="mdl-data-table__cell--non-numeric">{camper.alltime}</td>
	            </tr>
	          );
	      }) : '';

	      return (
	      		<table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
		          <thead>
		            <tr>
		              <th className="mdl-data-table__cell--non-numeric">#</th>
		              <th className="mdl-data-table__cell--non-numeric">username</th>
		              <th>recent</th>
		              <th>alltime</th>
		            </tr>
		          </thead>
		          <tbody>
		              {campers}
		          </tbody>
		        </table>
	      );
	}
}