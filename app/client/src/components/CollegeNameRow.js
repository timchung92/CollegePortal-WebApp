import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class CollegeNameRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
        <div>{this.props.name}</div>
		);
	}
}
