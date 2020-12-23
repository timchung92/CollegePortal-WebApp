import React from 'react';
import '../style/Top10Lists.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PageNavbar from './PageNavbar';
import CollegeListRow from './CollegeListRow';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Media from 'react-bootstrap/Media'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

export default class Top10Lists extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component
		this.state = {
			//variables here 
			colleges: [],
			regions: [],
			degrees: [],
			urbanizations: [],
			occupations: [],
			selectedControl: "ALL",
			selectedSize: "ALL",
			selectedDegUrban: "ALL",
			selectedRegion: "ALL",
			selectedTutionType: "ALL",
			selectedLevelOfStudy: "Undergraduate",
			selectedDegreeLevel: 'ALL',
			sortOrder: "DESC"
		}

		this.showTop10ByAcceptanceRate = this.showTop10ByAcceptanceRate.bind(this);
		this.showTop10ByTutionCost = this.showTop10ByTutionCost.bind(this);
		this.showTop10ByEarnings = this.showTop10ByEarnings.bind(this);
		this.showTop10ByJobs = this.showTop10ByJobs.bind(this);
		this.handleRegionFilterChange = this.handleRegionFilterChange.bind(this);
		this.handleControlFilterChange = this.handleControlFilterChange.bind(this);
		this.handleSizeFilterChange = this.handleSizeFilterChange.bind(this);
		this.handleLevelFilterChange = this.handleLevelFilterChange.bind(this);
		this.handleDegUrbanFilterChange = this.handleDegUrbanFilterChange.bind(this);
		this.handleTutionTypeFilterChange = this.handleTutionTypeFilterChange.bind(this);
		this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// handle change of Sorting order filter
	handleSortOrderChange(e) {
		this.setState({
			sortOrder: e.target.value
		});
		//console.log("selectedRegion: " + this.state.selectedRegion);
	}

	// handle change of region dropdown filter
	handleRegionFilterChange(e) {
		this.setState({
			selectedRegion: e.target.value
		});
		//console.log("selectedRegion: " + this.state.selectedRegion);
	}

	// handle change of tution type dropdown filter change
	handleTutionTypeFilterChange(e) {
		this.setState({
			selectedTutionType: e.target.value
		});
		//console.log("selectedTutionType: " + this.state.selectedTutionType);
	}

	handleDegUrbanFilterChange(e) {
		this.setState({
			selectedDegUrban: e.target.value
		});
		console.log("selectedDegUrban: " + this.state.selectedDegUrban);
	}

	handleControlFilterChange(e) {
		this.setState({
			selectedControl: e.target.value
			//e.target.value
		});
		//console.log(this.selectedControl);
		console.log("selectedControl: " + this.state.selectedControl);
	}

	handleSizeFilterChange(e) {
		this.setState({
			selectedSize: e.target.value
		});
		//console.log("selectedSize: " + this.state.selectedSize);
	}

	handleLevelFilterChange(e) {

		var levelOfStudy = "ALL";
		var input = e.target.value;
		console.log("input: " + input);

		if ((input.localeCompare("Associate's Degree") == 0) || (input.localeCompare("Bachelors Degree") == 0) || (input.localeCompare("Undergraduate Certificate or Diploma") == 0) || (input.localeCompare("First Professional Degree") == 0)) {
			levelOfStudy = "Undergraduate";
		} else if ((input.localeCompare("Doctoral Degree") == 0) || (input.localeCompare("Graduate/Professional Certificate") == 0) || (input.localeCompare("Master's Degree") == 0) || (input.localeCompare("Post-baccalaureate Certificate") == 0)) {
			levelOfStudy = "Graduate";
		}

		this.setState({
			selectedDegreeLevel: e.target.value,
			selectedLevelOfStudy: levelOfStudy
		});

		console.log("selectedDegreeLevel: " + this.state.selectedDegreeLevel);
		console.log("selectedLevelOfStudy: " + this.state.selectedLevelOfStudy);
	}

	// apply filter and show results 
	handleSubmit() {

		console.log("Filters applied, last search :" + this.state.currentSearch);

		if (this.state.currentSearch.localeCompare("AcceptanceRate") == 0) {
			console.log("calling showTop10ByAcceptanceRate");
			//this.showTop10ByAcceptanceRate();
			// this.showTop10ByAcceptanceRate.bind(this);
			this.showTop10ByAcceptanceRate();
		} else if (this.state.currentSearch.localeCompare("TutionCost") == 0) {
			console.log("calling showTop10ByTutionCost");
			this.showTop10ByTutionCost.bind(this);
		} else if (this.state.currentSearch.localeCompare("Earnings") == 0) {
			console.log("calling showTop10ByEarnings");
			this.showTop10ByEarnings.bind(this);
		} else if (this.state.currentSearch.localeCompare("Jobs") == 0) {
			console.log("calling showTop10ByJobs");
			this.showTop10ByJobs.bind(this);
		} else {
			this.componentDidMount();
		}
	}

	componentDidMount() {
		// Send an HTTP request to the server to get regions drop down values
		fetch("http://localhost:8081/regions",
			{	// The type of HTTP request.
				method: 'GET'
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(regionList => {
				if (!regionList) return;
				console.log(regionList);
				// Map each decade in decadesList to an dropdown element:
				let regionDivs = regionList.map((regionObj, i) =>
					<option key={i} value={regionObj.region}> {regionObj.region} </option>
				);

				// Set the state of the decade list to the value returned by the HTTP response from the server.
				this.setState({
					regions: regionDivs
				});
			}, err => {
				// Print the error if there is one.
				console.log(err);
			});

		// Send an HTTP request to the server to get urbanization drop down values.
		fetch("http://localhost:8081/urbanization",
			{
				method: 'GET' // The type of HTTP request.
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(urbanList => {
				if (!urbanList) return;
				console.log(urbanList);
				// Map each decade in decadesList to an dropdown element:
				let urbanDivs = urbanList.map((urbanObj, i) =>
					<option key={i} value={urbanObj.degree_urbanization}> {urbanObj.degree_urbanization} </option>
				);

				// Set the state of the decade list to the value returned by the HTTP response from the server.
				this.setState({
					urbanizations: urbanDivs
				});
			}, err => {
				// Print the error if there is one.
				console.log(err);
			});

		// Send an HTTP request to the server to get deglevel drop down values.
		fetch("http://localhost:8081/deglevel",
			{
				method: 'GET' // The type of HTTP request.
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(degreeList => {
				if (!degreeList) return;
				console.log(degreeList);
				// Map each decade in decadesList to an dropdown element:
				let degDivs = degreeList.map((degObj, i) =>
					<option key={i} value={degObj.description}> {degObj.description} </option>
				);

				// Set the state of the decade list to the value returned by the HTTP response from the server.
				this.setState({
					degrees: degDivs
				});
			}, err => {
				// Print the error if there is one.
				console.log(err);
			});

	}

	showTop10ByTutionCost() {

		var fetchURL = "http://localhost:8081/top10/tution/" + this.state.selectedControl + "/" + this.state.selectedSize + "/" + this.state.selectedRegion +
			"/" + this.state.selectedDegUrban + "/" + this.state.selectedTutionType + "/" + this.state.selectedLevelOfStudy + "/" + this.state.sortOrder;
		console.log(fetchURL);

		//		fetch(`http://localhost:8081/top10/tution/${this.state.selectedControl}/${this.state.selectedSize}/${this.state.selectedLevel}/${this.state.selectedRegion}/${this.state.selectedDegUrban}/${this.state.sortOrder}`,

		// Send an HTTP request to the server.
		fetch(fetchURL,
			{
				method: 'GET' // The type of HTTP request.
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(collegeList => {
				if (!collegeList) return;
				// Map each attribute of a college in this.state.colleges to an HTML element
				let collegeDivs = collegeList.map((college, i) =>
					<CollegeListRow name={college.InstitutionName} id={college.InstitutionID} location={college.location} url_school={college.url_school}
						data_year={college.year} attribute1Label={college.attribute1_label} attribute1Value={college.tuition_fee} />
				);

				// Set the state of the college list to the value returned by the HTTP response from the server.
				this.setState({
					colleges: collegeDivs
				});
			}, err => {
				// Print the error if there is one.
				console.log(err);
			});
	}

	showTop10ByEarnings() {

		// Send an HTTP request to the server.
		fetch(`http://localhost:8081/top10/earning/${this.state.selectedControl}/${this.state.selectedSize}/${this.state.selectedRegion}/${this.state.selectedDegUrban}/${this.state.selectedDegreeLevel}/${this.state.sortOrder}`,
			{
				method: 'GET' // The type of HTTP request.
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(collegeList => {
				if (!collegeList) return;
				// Map each attribute of a movie in this.state.movies to an HTML element
				let collegeDivs = collegeList.map((college, i) =>
					<CollegeListRow name={college.InstitutionName} id={college.InstitutionID} location={college.location} url_school={college.url_school}
						data_year={college.year} attribute1Label="Median Earning:" attribute1Value={college.earning_med}
						attribute2Label="Major:" attribute2Value={college.Major} />
				);

				// Set the state of the movies list to the value returned by the HTTP response from the server.
				this.setState({
					colleges: collegeDivs
				});
			}, err => {
				// Print the error if there is one.
				console.log(err);
			});
	}

	showTop10ByAcceptanceRate() {

		console.log("inside showTop10ByAcceptanceRate");
		console.log("selectedControl: " + this.state.selectedControl);
		console.log("selectedSize: " + this.state.selectedSize);
		console.log("selectedLevel: " + this.state.selectedLevel);
		console.log("selectedRegion: " + this.state.selectedRegion);
		console.log("selectedDegUrban: " + this.state.selectedDegUrban);
		console.log("sortOrder: " + this.state.sortOrder);

		var fetchURL = "http://localhost:8081/top10/acceptance/" + this.state.selectedControl + "/" + this.state.selectedSize + "/" + this.state.selectedRegion + "/" + this.state.selectedDegUrban + "/" + this.state.sortOrder;
		console.log(fetchURL);

		// Send an HTTP request to the server.
		fetch(fetchURL,
			{
				method: 'GET' // The type of HTTP request.
			}).then(res => {
				// Convert the response data to a JSON.
				return res.json();
			}, err => {
				// Print the error if there is one.
				console.log(err);
			}).then(collegeList => {
				if (!collegeList) return;
				// Map each attribute of a movie in this.state.movies to an HTML element
				let collegeDivs = collegeList.map((college, i) =>
					<CollegeListRow name={college.InstitutionName} id={college.InstitutionID} location={college.location} url_school={college.url_school}
						data_year={college.year} attribute1Label="Acceptance Rate" attribute1Value={college.acceptance_rate} />
				);

				// Set the state of the movies list to the value returned by the HTTP response from the server.
				this.setState({
					colleges: collegeDivs
				});
			}, err => {
				// Print the error if there is one.
				console.log(err);
			});
	}

	showTop10ByJobs() {
		// set current search to "Jobs"
		this.setState({
			currentSearch: "Jobs"
		});

		console.log(this.state.currentSearch);
	}

	//Need a render function. I'm copying sample method from HW2 if you need inspiration/structure
	// // {this.state.colleges}
	render() {

		return (

			<Container fluid>
				<Row><br></br></Row>

				<Row className="d-flex flex-wrap align-items-center">
					<Col> </Col>
					<Col xs={8}><Media>
						<img
							width={119}
							height={100}
							className="mr-3"
							src="LogosTop10.jpg"
							alt="Top 10 Colleges"
						/>
						<Media.Body>
							<h2>TOP 10 Colleges</h2>
							<p> Search for the best colleges in the country. Use one of the options (and or filters) below to find your dream college.</p>
						</Media.Body>
					</Media></Col>
					<Col> </Col>
				</Row>

				<Row><br></br></Row>

				<Row>
					<Col> </Col>
					<Col xs={8}>
						<Card>
							<Card.Body>
								<Card.Title>FILTER YOUR RESULTS</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">Select one or more parameters to narrow down the results</Card.Subtitle>
								<Card.Text> </Card.Text>
								<Form>
									<Form.Row>
										<Form.Group as={Col} md="4" controlId="filterControl">
											<Form.Label>Control of Institution</Form.Label>
											<Form.Control as="select" custom name="selectedControl" value={this.state.selectedControl} onChange={this.handleControlFilterChange}>
												<option value="ALL">All</option>
												<option value="Public"> Public </option>
												<option value="Private not-for-profit"> Private not-for-profit </option>
												<option value="Private for-profit"> Private for-profit </option>
											</Form.Control>
										</Form.Group>
										<Form.Group as={Col} md="4" controlId="filterSize">
											<Form.Label>Institution Size</Form.Label>
											<Form.Control as="select" custom lname="sizeFilter" value={this.state.selectedSize} onChange={this.handleSizeFilterChange}>
												<option value="ALL">All</option>
												<option value="Under 1,000"> Under 1,000 </option>
												<option value="1,000–4,999"> 1,000–4,999 </option>
												<option value="5,000–9,999"> 5,000–9,999 </option>
												<option value="10,000–19,999"> 10,000–19,999 </option>
												<option value="20,000 and above"> 20,000 and above </option>
											</Form.Control>
										</Form.Group>
										<Form.Group as={Col} md="4" controlId="filterLevel">
											<Form.Label>Degree Level</Form.Label>
											<Form.Control as="select" name="degreeFilter" value={this.state.selectedDegreeLevel} onChange={this.handleLevelFilterChange}>
												<option value="ALL">All</option>
												{this.state.degrees}
											</Form.Control>
										</Form.Group>
									</Form.Row>
									<Form.Row>
										<Form.Group as={Col} md="5" controlId="filterRegion">
											<Form.Label>Region</Form.Label>
											<Form.Control as="select" name="regionFilter" value={this.state.selectedRegion} onChange={this.handleRegionFilterChange}>
												<option value="ALL">All Regions</option>
												{this.state.regions}
											</Form.Control>
										</Form.Group>
										<Form.Group as={Col} md="4" controlId="filterDegUrban">
											<Form.Label>Degree of Urbanization</Form.Label>
											<Form.Control as="select" name="degUrbanFilter" value={this.state.selectedDegUrban} onChange={this.handleDegUrbanFilterChange}>
												<option value="ALL">All</option>
												{this.state.urbanizations}
											</Form.Control>
										</Form.Group>
										<Form.Group as={Col} md="3" controlId="filterTuitionType">
											<Form.Label>Tuition Type</Form.Label>
											<Form.Control as="select" name="tuitionTypeFilter" value={this.state.selectedTutionType} onChange={this.handleTutionTypeFilterChange}>
												<option value="ALL">All</option>
												<option value="In district">In district</option>
												<option value="In state">In state</option>
												<option value="Out of state">Out of state</option>
											</Form.Control>
										</Form.Group>
									</Form.Row>
									<Form.Row>
										<Form.Group as={Col} md="3" controlId="filterSortOrder">
											<Form.Label>Sort Results:</Form.Label>
											<Form.Control as="select" name="sortingFilter" value={this.state.sortOrder} onChange={this.handleSortOrderChange}>
												<option value="DESC">High to Low</option>
												<option value="ASC">Low to High</option>
											</Form.Control>
										</Form.Group>
									</Form.Row>
									<Form.Row>
										<Form.Group as={Col} md="4" >
											<Button variant="outline-primary" onClick={this.showTop10ByAcceptanceRate} size="lg" >
												<img className="option-btn-img" src="./accepted.png" alt="Top 10 Colleges by Acceptance Rate" />
												Acceptance
											</Button>
										</Form.Group>
										<Form.Group as={Col} md="4">
											<Button variant="outline-primary" onClick={this.showTop10ByTutionCost.bind()} size="lg" >
												<img className="option-btn-img" src="./cost.png" alt="Top 10 Colleges by Tuition Fee" />
												Tuition Fee
											</Button>
										</Form.Group>
										<Form.Group as={Col} md="4">
											<Button variant="outline-primary" onClick={this.showTop10ByEarnings.bind()} size="lg" >
												<img className="option-btn-img" src="./salary1.png" alt="Top 10 Colleges by Earnings" />
												Earnings
											</Button>
										</Form.Group>
									</Form.Row>
								</Form>
							</Card.Body>
						</Card>
					</Col>
					<Col> </Col>
				</Row>


				<Row><br></br></Row>

				<Row>
					<Col> </Col>
					<Col xs={7}>{this.state.colleges}</Col>
					<Col> </Col>
				</Row>

			</Container>

		);
	}
}