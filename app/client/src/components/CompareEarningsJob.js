import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/CompareEarningsJob.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Media from 'react-bootstrap/Media'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'

export default class CompareEarningsJob extends React.Component {
	constructor(props) {
		super(props);

		/* Make any necessary changes to state */
		this.state = {
			selectedMajorID: "0",
			selectedDegreeLevel: "none",
			degreeLevels: []
		};

		this.submitMajors = this.submitMajors.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeDegree = this.handleChangeDegree.bind(this);
	}

	/* ---- Q3a (Best Genres) ---- */
	componentDidMount() {
		// Send an HTTP request to the server.
		var majorMap = {
			"Agriculture Related Sciences": 1, "Natural Resources and Conservation": 3, "Architecture": 4,
			"Communication/Journalism": 4, "Computer Information Sciences": 11, "Education": 13, "Engineering": 14, "Engineering Technology/Technician": 15,
			"Foreign Language/Literature": 16, "Consumer/Human Sciences": 19, "Law": 22, "English Literature": 23, "Liberal Arts/Humanities": 24,
			"Biology/Biomedical Science": 26, "Mathematics/Statistics": 27, "Parks and Recreation": 31, "Philosophy/Religion": 38, "Theology": 39, "Physical Sciences": 40,
			"Psychology": 42, "Social Sciences": 45, "Mechanic and Repair Technician": 47, "Visual and Performing Arts": 50, "Health Professional": 51, "Business Administration": 52, "History": 54
		};

		var majorOptions = [];

		Object.keys(majorMap).forEach(function (key) {
			majorOptions.push(<option value={majorMap[key]}>{key}</option>)
		});

		this.setState({
			majors: majorOptions
		});

		fetch('http://localhost:8081/degree-levels', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(degreeListObj => {
			let degreeList = degreeListObj.map((degreeObj, i) =>
				<option key={i} value={degreeObj.description}>
					{degreeObj.description}
				</option>
			);

			this.setState({
				degreeLevels: degreeList
			});

		});
	}

	handleChange(e) {
		this.setState({
			selectedMajorID: e.target.value
		});
	}

	handleChangeDegree(e) {
		this.setState({
			selectedDegreeLevel: e.target.value
		});
	}

	/* ---- Q3b (Best Genres) ---- */
	submitMajors() {
		fetch("http://localhost:8081/Compare-Earnings/" + this.state.selectedMajorID + "/" + this.state.selectedDegreeLevel,
			{
				method: "GET"
			}).then(res => {
				return res.json();
			}, err => {
				console.log(err);

			}).then(majorList => {
				let majorTrs = majorList.map((majorObj, i) =>
					<tr key={i}>
						<td>{majorObj.major}</td>
						<td >{majorObj.median_starting_sal}</td>
						<td>{majorObj.median_salary}</td>
						<td>{majorObj.median_debt}</td>
						<td>{majorObj.ROI}</td>
						<td>{majorObj.job_openings_10_yr_change}</td>
						<td>{majorObj.degree_level}</td>
						<td>{majorObj.typical_work_experience}</td>
					</tr>
				);

				//This saves our HTML representation of the data into the state, which we can call in our render function
				this.setState({
					majorTrObjs: majorTrs,
					rowLength: majorTrs.length

				});
			});
	}

	render() {

		return (
			<Container fluid>
				<Row><br></br></Row>
				<Row className="d-flex flex-wrap align-items-center">
					<Col> </Col>
					<Col xs={8}><Media>
						<img
							width={100}
							height={100}
							className="mr-3"
							src="salary1.png"
							alt="Compare Earnings"
						/>
						<Media.Body>
							<h2>Compare Earnings By Major</h2>
							<p>
								Want to make a smart investment on what major to choose? See data on starting/mid-career salaries, student debt, ROI (as a function of starting salary and student debt) and job-growth related to specific majors to help you make the best decision.
    							</p>
						</Media.Body>
					</Media></Col>
					<Col> </Col>
				</Row>
				<Row><br></br></Row>

				<Row>
					<Col xs={2}></Col>
					<Col xs={8}>
						<Card>
							<Card.Body>
								<Card.Title>FILTER YOUR RESULTS</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">Select major category and/or degree level to narrow down the results</Card.Subtitle>
								<Card.Text> </Card.Text>
								<Row>
									<Col xs={1}></Col>
									<Row></Row>
									<Card.Body>
										<Form.Row>
											<Form.Group as={Col} md="3" controlId="formMajor">
												<Form.Label>Major Category</Form.Label>
												<Form.Control as="select" name="selectedMajor" value={this.state.selectedMajorID} onChange={this.handleChange}>
													<option value="%">All Majors</option>
													{this.state.majors}
												</Form.Control>
											</Form.Group>
											<Form.Group as={Col} md="3" controlId="formDegree">
												<Form.Label>Degree Level</Form.Label>
												<Form.Control as="select" name="selectedDegree" value={this.state.selectedDegreeLevel} onChange={this.handleChangeDegree} >
													<option value="none">All Degree Levels</option>
													{this.state.degreeLevels}
												</Form.Control>
											</Form.Group>
										</Form.Row>
									</Card.Body>
								</Row>
								<Form.Row>
									<Form.Group as={Col} md="3" controlId="formSubmit">
										<Button type="submit" onClick={this.submitMajors}>Search</Button>
									</Form.Group>
								</Form.Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col> </Col>
					{this.state.rowLength == 0 &&
						<Col xs="7">No results found with these critera. Please search again.</Col>}
					<Col> </Col>
				</Row>
				<Row><br></br></Row>
				<Row>
					<Col xs={2}></Col>
					{this.state.rowLength > 0 && <Col xs={8}>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Major</th>
									<th>Median Starting Salary</th>
									<th>Median Overall Salary</th>
									<th>Median Debt</th>
									<th>ROI</th>
									<th>Job Openings Growth</th>
									<th>Degree Level</th>
									<th>Typical Work Experience</th>
								</tr>
							</thead>
							<tbody>
								{this.state.majorTrObjs}
							</tbody>
						</Table>
					</Col>}
				</Row>

			</Container>
		);
	}
}
