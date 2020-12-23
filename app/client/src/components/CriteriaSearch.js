import React from 'react';
import PageNavbar from './PageNavbar';
import CriteriaSearchRow from './CriteriaSearchRow';
import '../style/CriteriaSearch.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Media from 'react-bootstrap/Media'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'



export default class CriteriaSearch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedState: "%",
			selectedControl: "%",
			selectedRegion: "%",
			selectedLevel: "%",
			selectedSize: "%",
			selectedTuitiontype: "%",
			selectedHousing: "%",
			selectedMajor: "%",
			selectedSelective: "%",
			selectedLimit: "%",
			states: [],
			controls: [],
			regions: [],
			levels: [],
			sizes: [],
			tuitiontypes: [],
			housings: [],
			majors: [],
			selectives: []
		};

		this.submitCriteria = this.submitCriteria.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		fetch('http://localhost:8081/states', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(stateListObj => {

			let stateList = stateListObj.map((stateObj, i) =>
				<option key={i} value={stateObj.state}>
				{stateObj.state}
				</option>
			);

			this.setState({
				states: stateList,
				selectedState: "%",
			});

		});

		fetch('http://localhost:8081/controls', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(controlListObj => {

			let controlList = controlListObj.map((controlObj, i) =>
				<option key={i} value={controlObj.control}>
				{controlObj.control}
				</option>
			);

			this.setState({
				controls: controlList,
				selectedControl: "%",
			});

		});

		fetch('http://localhost:8081/regions', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(regionListObj => {

			let regionList = regionListObj.map((regionObj, i) =>
				<option key={i} value={regionObj.region}>
				{regionObj.region}
				</option>
			);

			this.setState({
				regions: regionList,
				selectedRegion: "%",
			});

		});

		fetch('http://localhost:8081/levels', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(levelListObj => {

			let levelList = levelListObj.map((levelObj, i) =>
				<option key={i} value={levelObj.level}>
				{levelObj.level}
				</option>
			);

			this.setState({
				levels: levelList,
				selectedLevel: "%",
			});

		});

		fetch('http://localhost:8081/sizes', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(sizeListObj => {

			let sizeList = sizeListObj.map((sizeObj, i) =>
				<option key={i} value={sizeObj.size}>
				{sizeObj.size}
				</option>
			);

			this.setState({
				sizes: sizeList,
				selectedSize: "%",
			});

		});

		fetch('http://localhost:8081/tuitiontypes', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(tuitiontypeListObj => {

			let tuitiontypeList = tuitiontypeListObj.map((tuitiontypeObj, i) =>
				<option key={i} value={tuitiontypeObj.tuitiontype}>
				{tuitiontypeObj.tuitiontype}
				</option>
			);

			this.setState({
				tuitiontypes: tuitiontypeList,
				selectedTuitiontype: "%",
			});

		});

			/* Make a manual dropdown for user friendliness

		fetch('http://localhost:8081/housings', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(housingListObj => {

			let housingList = housingListObj.map((housingObj, i) =>
				<option key={i} value={housingObj.housing}>
				{housingObj.housing}
				</option>
			);

			this.setState({
				housings: housingList,
				selectedHousing: "%",
			});

		});

			*/

		fetch('http://localhost:8081/majors', {
			method: 'GET'
		}).then(res => {
			return res.json();
		}).then(majorListObj => {

			let majorList = majorListObj.map((majorObj, i) =>
				<option key={i} value={majorObj.major}>
				{majorObj.major}
				</option>
			);

			this.setState({
				majors: majorList,
				selectedMajor: "%",
			});

		});

	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	submitCriteria() {
		let state = this.state.selectedState;
		let control = this.state.selectedControl;
		let region = this.state.selectedRegion;
		let level = this.state.selectedLevel;
		let size = this.state.selectedSize;
		let tuitiontype = this.state.selectedTuitiontype;
		let housing = this.state.selectedHousing;
		let major = this.state.selectedMajor;
		let selective = this.state.selectedSelective;
		let limit = this.state.selectedLimit;
		let url = new URL('http://localhost:8081/criteriasearch/');
		let queryParams = {state: state, control: control, region: region, level: level, size: size, tuitiontype: tuitiontype, housing: housing, major: major, selective: selective, limit: limit};
		//If there are more than one query parameters, this is useful.
		Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
		fetch(url, {
			method: 'GET'
		}).then(res => {
			return res.json();
		}, err => {
			return console.log(err);
		}).then(criteriaList => {
			let criteriaSearchDivs = criteriaList.map((criteria, i) => 
				<CriteriaSearchRow criteria={criteria} />
			); 

			this.setState({
				schools: criteriaSearchDivs,
				rowlength: criteriaSearchDivs.length
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
							src="searchicon.png"
							alt="Criteria Search"
						/>
						<Media.Body>
							<h2>College Criteria Search (Undergraduate)</h2>
							<p>
								Select various criteria below to find matching undergraduate college and universities.<br />By default, it will return the first ten in alphabetical order, although you can select up to 100.
    							</p>
						</Media.Body>
					</Media></Col>
					<Col> </Col>
				</Row>

				<Row>
					<Col> </Col>
					<Col xs={8}>

					<Card>
					<Card.Body>
						<Form.Row>
							<Form.Group as={Col} md="3" controlId="formState">
								<Form.Label>State</Form.Label>
								<Form.Control as="select" name="selectedState" value={this.state.selectedState} onChange={this.handleChange}>
								<option value="%">All States</option>
									{this.state.states}
								</Form.Control>
							</Form.Group>
							<Form.Group as={Col} md="3" controlId="formSize">
								<Form.Label>Size</Form.Label>
								<Form.Control as="select" name="selectedSize" value={this.state.selectedSize} onChange={this.handleChange} >
								<option value="%">All Sizes</option>
				            	<option value="Under 1,000">Under 1,000</option>
				            	<option value="1,000–4,999">1,000–4,999</option>
				            	<option value="5,000–9,999">5,000–9,999</option>
				            	<option value="10,000–19,999">10,000–19,999</option>
				            	<option value="20,000 and above">20,000 and above</option>
								</Form.Control>
							</Form.Group>
							<Form.Group as={Col} md="3" controlId="formSelectivity">
								<Form.Label>Selectivity</Form.Label>
								<Form.Control as="select" name="selectedSelective" value={this.state.selectedSelective} onChange={this.handleChange} >
				            	<option value="%">All Selectivity</option>
				            	<option value="High">Highly Selective</option>
				            	<option value="Moderate">Moderately Selective</option>
				            	<option value="Minimal">Minimally Selective</option>
								</Form.Control>
							</Form.Group>
							<Form.Group as={Col} md="3" controlId="formMajor">
								<Form.Label>Major</Form.Label>
								<Form.Control as="select" name="selectedMajor" value={this.state.selectedMajor} onChange={this.handleChange} >
								<option value="%">All Majors</option>
									{this.state.majors}
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col} md="3" controlId="formRegion">
								<Form.Label>Region</Form.Label>
								<Form.Control as="select" name="selectedRegion" value={this.state.selectedRegion} onChange={this.handleChange} >
								<option value="%">All Regions</option>
									{this.state.regions}
								</Form.Control>
							</Form.Group>
							<Form.Group as={Col} md="3" controlId="formHousing">
								<Form.Label>Housing</Form.Label>
								<Form.Control as="select" name="selectedHousing" value={this.state.selectedHousing} onChange={this.handleChange} >
				            	<option value="%">All Housing</option>
				            	<option value="Yes">On-Campus Housing</option>
				            	<option value="No">No Housing</option>
								</Form.Control>
							</Form.Group>

							<Form.Group as={Col} md="3" controlId="formControl">
								<Form.Label>Public or Private</Form.Label>
								<Form.Control as="select" name="selectedControl" value={this.state.selectedControl} onChange={this.handleChange} >
								<option value="%">All Types</option>
								<option value="Public">Public</option>
								<option value="Private not-for-profit">Private not-for-profit</option>
								<option value="Private for-profit">Private for-profit</option>
								</Form.Control>
							</Form.Group>
							<Form.Group as={Col} md="3" controlId="formLimit">
								<Form.Label># of Results</Form.Label>
								<Form.Control as="select" name="selectedLimit" value={this.state.selectedLimit} onChange={this.handleChange} >
				            	<option value="%">Default (10)</option>
				            	<option value="10">10 Results</option>
				            	<option value="25">25 Results</option>
				            	<option value="50">50 Results</option>
				            	<option value="100">100 Results</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>
						<Form.Row>
							<Form.Group as={Col} md="3" controlId="formSubmit">
								<Button type="submit" onClick={this.submitCriteria}>Search</Button>
							</Form.Group>
						</Form.Row>
					</Card.Body>
					</Card>
					</Col>
					<Col> </Col>
				</Row>
				<Row>
					<Col> </Col>
					{this.state.rowlength == 0 &&
					<Col xs="7">No results found with these critera. Please search again.</Col>}
					<Col> </Col>
				</Row>
				<Row>
					<Col> </Col>
					{this.state.rowlength > 0 &&
					<Col xs="7">{this.state.rowlength} results displayed below:</Col>}
					<Col> </Col>
				</Row>
				<Row><br></br></Row>
				<Row>
					<Col> </Col>
					<Col xs={7}>{this.state.schools}</Col>
					<Col> </Col>
				</Row>
			</Container>
		);
	}
}
