import React from 'react';
import '../style/TuitionRow.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TuitionRow extends React.Component {
	constructor(props) {
		super(props);


	}


	
/* add an estimated books and fees to table below and also the query! */
/* also add an average merit scholarship*/
/* 				<h6>Still got some questions? Click <a href={this.props.url_fin_aid} target="_blank">here</a> to reach this school's financial aid department!</h6>
*/
	render() {
		return (
			<div className="tuitionResults">
				<div className="tuition_type">{this.props.tuition_type}</div>
				<br></br>
					<div className="tuition_fees">${this.props.tuition_fees}</div>
					<div className="url_fin_aid"><a href={'http://'+this.props.url_fin_aid} target="_blank">Link</a></div>

			</div>
		);
	}
}

