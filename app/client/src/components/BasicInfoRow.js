import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BasicInfoRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="basicInfoResults">
				<p class="fa fa-angle-double-right">Institution: {this.props.name}</p>
				<br></br>
				<p class="fa fa-angle-double-right">Address: {this.props.address}, {this.props.city}, {this.props.state} {this.props.zip}</p>
				<br></br>
				<p class="fa fa-angle-double-right">Phone: {this.props.phone}</p>
				<br></br>
				<p class="fa fa-angle-double-right">Neighborhood Type: {this.props.degree_urbanization}</p>
			</div>
		);
	}
}
