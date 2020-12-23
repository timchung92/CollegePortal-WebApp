import React from 'react';
// import '../style/MajorRow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class MajorRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<td>{this.props.title}</td>
			</tr>

		);
	}
}

