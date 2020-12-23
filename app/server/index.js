const bodyParser = require('body-parser');
var express = require('express');
var routes = require("./routes.js");
var mysql = require('mysql');
const cors = require('cors');

var app = express();

var con = mysql.createConnection({
	host: "college-portal2.cav9aftoz67a.us-east-1.rds.amazonaws.com",
	user: "admin",
	password: "cisteam550",
	database: "college_portal",
	port: 3306
});



con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	//con.end();
});


app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- Majors ---- */
app.get('/majors', routes.getMajors);

/* ---- Compare Earning ---- */
app.get('/Compare-Earnings/:majorID/:degree', routes.compareEarningsPerMajor);
app.get('/degree-levels', routes.getDegreeLevels);

/* ---- Route here ---- */
app.get('/viewbook-college/:id', routes.getCollegeName);

/* ---- Route here ---- */
app.get('/viewbook-majors/:id', routes.getViewbookMajors);

/* ---- Route here ---- */
app.get('/viewbook-basic-info/:id', routes.getViewbookBasicInfo);

/* ---- Route here ---- */
app.get('/viewbook-application/:id', routes.getApplicationInfo);

/* ---- Route here ---- */
app.get('/viewbook-tuition/:id', routes.getTuitionInfo);

/* ---- TOP 10 Lists Related Routes here ---- */
// routes.getTenColleges, specified in routes.js.
// app.get('/top10lists', routes.getTenColleges);

// top 10 colleges by acceptance rate
app.get('/top10/acceptance/:control/:size/:region/:degUrban/:sortOrder', routes.getTop10ByAcceptanceRate);

// top 10 colleges by tution cost
app.get('/top10/tution/:control/:size/:region/:degUrban/:tutionType/:levelOfStudy/:sortOrder', routes.getTop10ByTutionFee);

// top 10 colleges by earning
app.get('/top10/earning/:control/:size/:region/:degUrban/:degreeLevel/:sortOrder', routes.getTop10ByEarning);

/* ---- Dynamic Dropdown Routes here ---- */

// get regions for dropdown filter list
app.get('/regions', routes.getRegions);

// get degree of urbanization for dropdown filter list
app.get('/urbanization', routes.getUrbanization);

// get degree of urbanization for dropdown filter list
app.get('/deglevel', routes.getDegreeLevels);

// get states for dropdown filter list
app.get('/states', routes.getStates);

// Get controls (public, private, etc.) for dropdown filter list
app.get('/controls', routes.getControls);

// Get levels (two-year, four-year, etc.) for dropdown filter list
app.get('/levels', routes.getLevels);

// Get enrollment sizes for dropdown filter list
app.get('/sizes', routes.getSizes);

// Get tuition types (in-states, etc.) for dropdown filter list
app.get('/tuitiontypes', routes.getTuitiontypes);

/* ---- Criteria Search Routes here ---- */

// Criteria search
app.get('/criteriasearch', routes.criteriaSearch);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
