import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Media from 'react-bootstrap/Media'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class CriteriaSearchRow extends React.Component {
	constructor(props) {
		super(props);
	}

	addDefaultSrc(e){
  		e.target.src = 'university.png'
	}

/* Contents of the HTML elements to show a College row. */
render() {
	var websiteURL = (this.props.criteria.url_school === "N/A") ? `https://www.google.com/search?q=${this.props.criteria.name}/` : "//" + this.props.criteria.url_school;
	var logoURL = "//logo.clearbit.com/" + this.props.criteria.url_school;
	var viewbookURL = "http://localhost:3000/viewbook/?id=" + this.props.criteria.id;

	return (

		<Media>
			<img
				width={100}
				height={100}
				className="align-self-start mr-3"
				src={logoURL}
				alt={this.props.criteria.name}
				onError={this.addDefaultSrc}
			/>
			<Media.Body>
				<h4>{this.props.criteria.name}</h4>
				<Row>
					<Col>{this.props.criteria.city}, {this.props.criteria.state}<br />
					{this.props.criteria.control}</Col>
					<Col><Button href={viewbookURL} variant="primary">View School</Button></Col>
				</Row>
				<Row><Col>Enrollment: {this.props.criteria.size}</Col></Row>
				<Row><Col>Acceptance Rate: {this.props.criteria.selectivity}%</Col></Row>
				<Row><Col><a href={websiteURL} target="_blank" rel="noreferrer noopener">{this.props.criteria.url_school}</a></Col></Row>
				<hr className="narrow"></hr>
			</Media.Body>
		</Media>

	);
}
}
