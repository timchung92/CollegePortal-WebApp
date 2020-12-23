import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../style/CollegeViewbook.css';
import BasicInfoRow from './BasicInfoRow';
import MajorRow from './MajorRow.js';
import CollegeNameRow from './CollegeNameRow.js';
import AppRow from './AppRow.js';
import TuitionRow from './TuitionRow.js';
import NextStepsText from './NextStepsText.js';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Carousel from 'react-bootstrap/Carousel'


export default class CollegeViewbook extends React.Component {
	constructor(props) {
		super(props);


		/* Make any necessary changes to state */
		this.state = {
			id: '',
			college: [],
			majors: [],
			infos: [],
			tuitions: [],
			applications: [],
			isShowingNextSteps: false,
			isShowingTuition: false,
			isShowingMajors: false
		}

		this.getApplicationInfo = this.getApplicationInfo.bind(this);
		this.getMajorInfo = this.getMajorInfo.bind(this);
		this.getNextSteps = this.getNextSteps.bind(this);
		this.getTuitionInfo = this.getTuitionInfo.bind(this);
		this.handleIDChange = this.handleIDChange.bind(this);
	}

	// handle change of Sorting order filter
	handleIDChange(val) {
		console.log("inside handle" + val);
		this.setState({
			id: val
		});
	}

	/* ---- Add methods and modify render function below ---- */
	componentDidMount() {
		console.log("before update" + this.state.id);

		const params = new URLSearchParams(window.location.search);
		const collegeId = params.get("id");
		console.log(collegeId); // "sai"

		this.handleIDChange(collegeId);

		console.log("after update" + this.state.id);

		fetch("http://localhost:8081/viewbook-college/" + collegeId, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}
		).then(collegeName => {
			if (!collegeName) return;
			let nameDivs = collegeName.map((collegeObj, i) =>
				<CollegeNameRow name={collegeObj.name} />
			)


			//set state
			this.setState({
				college: nameDivs,
				id: collegeId
			})
		}, err => {
			console.log(err);
		}
		);

		fetch("http://localhost:8081/viewbook-majors/" + collegeId, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}
		).then(majorsList => {
			if (!majorsList) return;
			let majorsDivs = majorsList.map((majorObj, i) =>
				<MajorRow title={majorObj.title} />
			);

			//set state
			this.setState({
				majors: majorsDivs,
				isShowingNextSteps: false,
				isShowingMajors: true,
				isShowingTuition: false
			})
		}, err => {
			console.log(err);
		});

		fetch("http://localhost:8081/viewbook-basic-info/" + collegeId, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}
		).then(infoList => {
			if (!infoList) return;
			let infoDivs = infoList.map((infoObj, i) =>
				<BasicInfoRow key={infoObj.name} name={infoObj.name} address={infoObj.address} state={infoObj.state} city={infoObj.city} zip={infoObj.zip} phone={infoObj.phone} degree_urbanization={infoObj.degree_urbanization} />
			);

			//set state
			this.setState({
				infos: infoDivs,
				isShowingNextSteps: false
			})
		}, err => {
			console.log(err);
		});
	}

	/* onClick methods here*/

	/* getMajorInfo */
	getMajorInfo() {
		fetch("http://localhost:8081/viewbook-majors/" + this.state.id, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}
		).then(majorsList => {
			if (!majorsList) return;
			let majorsDivs = majorsList.map((majorObj, i) =>
				<MajorRow key={majorObj.title} title={majorObj.title} />
			);

			//set state
			this.setState({
				majors: majorsDivs,
				tuitions: [],
				applications: [],
				isShowingNextSteps: false,
				isShowingMajors: true,
				isShowingTuition: false
			})
		}, err => {
			console.log(err);
		});
	}

	/* getApplicationInfo */
	getApplicationInfo() {
		fetch("http://localhost:8081/viewbook-application/" + this.state.id, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}
		).then(appList => {
			if (!appList) return;
			let appDivs = appList.map((appObj, i) => /* fix these below */
				<AppRow key={appObj.url_school} percent_accepted={appObj.percent_accepted} size={appObj.size} url_school={appObj.url_school} url_application={appObj.url_application} />
			);

			//set state
			this.setState({
				majors: [],
				tuitions: [],
				applications: appDivs,
				isShowingNextSteps: false,
				isShowingTuition: false,
				isShowingMajors: false
			})
		}, err => {
			console.log(err);
		});
	}

	/* getTuitionInfo */
	getTuitionInfo() {
		fetch("http://localhost:8081/viewbook-tuition/" + this.state.id, {
			method: 'GET',
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}
		).then(tuitionList => {
			if (!tuitionList) return;
			let tuitionDivs = tuitionList.map((tuitionObj, i) => /* fix these below */
				<TuitionRow key={tuitionObj.url_fin_aid} tuition_type={tuitionObj.tuition_type} tuition_fees={tuitionObj.tuition_fees} url_fin_aid={tuitionObj.url_fin_aid} />
			);

			//set state
			this.setState({
				majors: [],
				tuitions: tuitionDivs,
				applications: [],
				isShowingNextSteps: false,
				isShowingTuition: true,
				isShowingMajors: false
			})
		}, err => {
			console.log(err);
		});
	}

	/* getNextSteps*/
	getNextSteps() {
		this.setState({
			majors: [],
			tuitions: [],
			applications: [],
			isShowingNextSteps: true,
			isShowingTuition: false,
			isShowingMajors: false
		})

	}

	/* For sake of testing, html code from movie method here */

	render() {
		return (

			<Container fluid>
				<Row><br></br></Row>

				<Row className="d-flex flex-wrap align-items-center">
					<Col> </Col>
					<Col xs={8}>
						<h1>{this.state.college}</h1>
					</Col>
					<Col> </Col>
				</Row>

				<Row><br></br></Row>

				<Row>
					<Col> </Col>
					<Col xs={3}>
						<Card>
							<Card.Body>
								<Card.Title>QUICK FACTS</Card.Title>
								<Card.Subtitle className="mb-2 text-muted"> </Card.Subtitle>
								<Card.Text> <br></br> <br></br>  <h5>{this.state.infos}</h5> <br></br> <br></br></Card.Text>
							</Card.Body>
						</Card>
					</Col>
					<Col xs={5}>
						<Carousel>
							<Carousel.Item>
								<img
									className="d-block"
									height={400}
									src={require('./campus_photos/picture2.jpg')}
									alt="First slide"
								/>
							</Carousel.Item>
							<Carousel.Item>
								<img
									className="d-block"
									height={400}
									src={require('./campus_photos/picture1.jpg')}
									alt="Second slide"
								/>
							</Carousel.Item>
							<Carousel.Item>
								<img
									className="d-block"
									height={400}
									src={require('./campus_photos/picture4.jpg')}
									alt="Third slide"
								/>
							</Carousel.Item>
						</Carousel>
					</Col>
					<Col> </Col>
				</Row>

				<Row><br></br></Row>

				<Row>
					<Col xs={2}> </Col>
					<Col xs={2}>
						<Button variant="outline-primary" onClick={this.getMajorInfo} size="lg" > Available Majors </Button>
					</Col>
					<Col xs={2}>
						<Button variant="outline-primary" onClick={this.getApplicationInfo} size="lg" > Application Information </Button>
					</Col>
					<Col xs={2}>
						<Button variant="outline-primary" onClick={this.getTuitionInfo} size="lg" > Tuition Information </Button>
					</Col>
					<Col xs={2}>
						<Button variant="outline-primary" onClick={this.getNextSteps} size="lg" > Meet Us! </Button>
					</Col>
					<Col xs={2}> </Col>
				</Row>

				<Row><br></br></Row>

				<Row>
					<Col> </Col>
					<Col xs={8}>
						{this.state.isShowingMajors && <h3>Majors Available at this Institution</h3>}
						<Table borderless>
							<tbody>
								{this.state.majors}
							</tbody>
						</Table>
					</Col>
					<Col> </Col>
				</Row>



				<Row>
					<Col> </Col>
					<Col xs={8}>{this.state.applications}</Col>
					<Col> </Col>
				</Row>

				<Row>
					<Col> </Col>
					<Col xs={8}>{this.state.isShowingTuition && <h3>Tuition Information</h3>}
					</Col>
					<Col> </Col>
				</Row>

				<Row><br></br></Row>
				<Row>
					<Col> </Col>
					<Col xs={8}>{this.state.tuitions}</Col>
					<Col> </Col>
				</Row>

				<Row>
					<Col> </Col>
					<Col xs={8}>{this.state.isShowingNextSteps && <NextStepsText />}
					</Col>
					<Col> </Col>
				</Row>
			</Container>

		);
	}
}