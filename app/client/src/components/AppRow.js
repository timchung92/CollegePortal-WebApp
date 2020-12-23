import React from 'react';
import '../style/AppRow.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AppRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="appResults">
				<br></br>
				<h3>Thinking about applying? Here a few things to know about this school’s application process.</h3>
				<br></br>
				<ol>
					<li>Visit their website: <a href={'http://'+this.props.url_school} target="_blank">{this.props.url_school}</a>. Get a feel for who they are as a community. Make sure your personal statement speaks specifically to how you will fit into the environment and what you will contribute.</li>
					<li>{this.props.size} students apply every year</li>
					<li>This school's acceptance rate is {this.props.percent_accepted}%</li>
					<li>Visit the <a href={'http://'+this.props.url_application} target="_blank"> admissions website</a> to schedule a tour, speak to an admissions representative, and make sure you have all you need to submit your application!</li>
				</ol>
			</div>
		);
	}
}
