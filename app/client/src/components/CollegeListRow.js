import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../style/Top10Lists.css';
import Media from 'react-bootstrap/Media'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class CollegeListRow extends React.Component {
	constructor(props) {
		super(props);
	}

	addDefaultSrc(e) {
		e.target.src = 'university.png'
	}


	/* Contents of the HTML elements to show a College row. */
	render() {
		var websiteURL = (this.props.url_school === "N/A") ? `https://www.google.com/search?q=${this.props.name}/` : "//" + this.props.url_school;
		var logoURL = "//logo.clearbit.com/" + this.props.url_school;
		var viewbookURL = "http://localhost:3000/viewbook/?id=" + this.props.id;

		return (

			<Media>
				<img
					width={100}
					height={100}
					className="align-self-start mr-3"
					src={logoURL}
					alt={this.props.name}
					onError={this.addDefaultSrc}
				/>
				<Media.Body>
					<h4 align="left">{this.props.name}</h4>
					<Row>
						<Col>{this.props.location}</Col>
						<Col><Button href={viewbookURL} variant="primary">View School</Button></Col>
					</Row>
					<Row><Col><a href={websiteURL} target="_blank" rel="noreferrer noopener">{this.props.url_school}</a></Col></Row>
					<Row><Col>{this.props.attribute1Label} <span className="number-callout">{this.props.attribute1Value}</span></Col></Row>
					<Row><Col>{this.props.attribute2Label} <span className="number-callout">{this.props.attribute2Value}</span></Col></Row>
					<p><i>Based on data available for year {this.props.data_year}.</i></p>
					<hr className="narrow"></hr>
				</Media.Body>
			</Media>

		);
	}
}
