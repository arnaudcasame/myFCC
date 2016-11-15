import React, { Component } from 'react';

class Table extends Component {
	constructor(props){
		super()
		this.state = {};
	}

	render(){
		let temporaire = this.props.data;

		let show = null;

	    if(this.props.view === 'Recent'){
	    	show = 'Alltime';
	    }else{
	      	show = 'Recent';
	    }

	    let campers = temporaire ? temporaire.map((camper, i) => {
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
		              <th>{show}</th>
		              <th>recent</th>
		            </tr>
		          </thead>
		          <tbody>
		              {campers}
		          </tbody>
		        </table>
	      );
	}
}

export default Table;