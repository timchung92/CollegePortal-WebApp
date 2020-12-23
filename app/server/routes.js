var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- (Get Degree Levels) ---- */
function getDegreeLevels(req, res) {
	var query = `
    SELECT description as degree_level FROM degree_level;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}
/* ---- Queries here ---- */
function getViewbookMajors(req,res) {
	var query = `SELECT DISTINCT m.title
	FROM college_portal.major m
	JOIN college_portal.program p ON m.id = p.major
	JOIN college_portal.degree_level d ON p.degree_level = d.id 
	WHERE p.institution = 100654
	ORDER BY m.title ASC; 
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
};

/* ---- Q3 (Compare By Major) ---- */
function compareEarningsPerMajor(req, res) {
	var id = parseInt(req.params.majorID);
	if (id == 0) {
		var id_end = 100;
	} else {
		var id_end = id + 1;
	}
	var degree = req.params.degree == "none" ? "%": req.params.degree;

	var query = `
	WITH non_agg_results AS (
		SELECT 
			m.title, 
			pde.earning_med, 
			pde.debt_med,
			os.wage_med,
			os.openings_2019, 
			os.openings_2029,
			os.education_req,
			os.avg_work_exp,
			os.openings_10yr_perc_change,
			dl.description as degree_level,
			dl.id
			
		FROM major m
			JOIN major_occupation mo ON m.id = mo.major
			JOIN (SELECT id FROM occupation) o ON mo.occupation = o.id
			JOIN occupation_summary os ON o.id = os.occupation
			JOIN (SELECT id, major, degree_level FROM program) p ON m.id = p.major
			JOIN (SELECT program, earning_med, debt_med FROM program_debt_earning) pde ON p.id = pde.program
			JOIN degree_level dl on p.degree_level = dl.id
		
		WHERE  							# Depends on user selected filters
			m.id >= ? and m.id < ?			#list of major ids
			AND dl.description LIKE ?			# degree level selection
	
	), group_by_title AS (
		SELECT
			title AS major, 
			CONCAT('$',  ROUND(AVG(earning_med),2)) AS median_starting_sal, 
			CONCAT('$', ROUND(AVG(wage_med),2)) AS median_salary, 
			CONCAT('$', ROUND(AVG(debt_med),2)) AS median_debt, 
			CONCAT(ROUND(((AVG(earning_med) - AVG(debt_med)) / AVG(debt_med)) * 100, 2), '%') as ROI,
			SUM(openings_2019) AS job_openings_2019, 
			SUM(openings_2029) AS job_openings_2029, 
			CONCAT(ROUND(AVG(openings_10yr_perc_change),2),'%') AS job_openings_10_yr_change
		FROM non_agg_results 
		GROUP BY title
		
	), count_degree_level AS (
		SELECT title, COUNT(*) AS degree_level_cnt, degree_level
		FROM non_agg_results nar
		GROUP BY title, degree_level
		
	), mode_degree_level AS (
		SELECT title, degree_level
		FROM count_degree_level
		GROUP BY title
		HAVING max(degree_level_cnt)
		
	), count_edu_req AS (
		SELECT title, COUNT(*) AS education_req_cnt, education_req
		FROM non_agg_results nar
		GROUP BY title, education_req
		
	), mode_edu_req AS (
		SELECT title, education_req
		FROM count_edu_req
		GROUP BY title
		HAVING max(education_req_cnt)
		
	), count_work_exp AS (
		SELECT title, COUNT(*) AS avg_work_exp_cnt, avg_work_exp
		FROM non_agg_results nar
		GROUP BY title, avg_work_exp
		
	), mode_work_exp AS (
		SELECT title, avg_work_exp
		FROM count_work_exp
		GROUP BY title
		HAVING max(avg_work_exp_cnt)
	) 
	
	SELECT 
		gt.*, 
		mdl.degree_level, 
		mer.education_req as typical_education, 
		mwe.avg_work_exp as typical_work_experience
		
	FROM group_by_title gt 
		JOIN mode_degree_level mdl ON gt.major = mdl.title 
		JOIN mode_edu_req mer ON gt.major = mer.title 
		JOIN mode_work_exp mwe ON gt.major = mwe.title
	
	#ORDER BY 				# Depends on user selected sort
		#median_starting_sal,
		#median_salary,
		#median_debt,
		#ROI,
		#job_openings_2019,
		#job_openings_2029
	
	#LIMIT					# Depends on user selected limit;`

  connection.query(query, [id, id_end, degree] ,function(err, rows, fields) {
	if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


/* ---- Queries here ---- */
function getViewbookBasicInfo(req,res){
	var query = `SELECT i.name, d.address, d.state, d.city, d.zip, d.phone, d.degree_urbanization
	FROM college_portal.institution i JOIN college_portal.demographic d ON i.id = d.institution
	WHERE i.id = 100654
	AND i.data_year = 
	(SELECT MAX(n.data_year) 
	FROM college_portal.institution n 
	WHERE n.id = i.id)
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
};


/* ---- Queries here ---- */
function getApplicationInfo(req,res){
	var query = `SELECT CEILING(MAX((e.number_admitted / e.number_applied) * 100)) AS percent_accepted, 
	i.size, i.url_school, i.url_application
	FROM college_portal.enrollment e 
	JOIN college_portal.institution i ON e.institution = i.id
	WHERE e.institution = 100654
	AND e.year = 
	(SELECT MAX(f.year) 
	FROM college_portal.enrollment f 
	WHERE f.institution = e.institution) 
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
};

/* ---- Queries here ---- */
function getTuitionInfo(req,res){
	var query = `SELECT t.tuition_type, AVG(t.tuition_fees_ft) AS tuition_fees, i.url_fin_aid 
	FROM college_portal.tuition t 
	JOIN college_portal.institution i ON t.institution = i.id
	WHERE i.data_year = t.year
	AND t.institution = 100654
	AND t.year = 
	(SELECT MAX(y.year) 
	FROM college_portal.tuition y 
	WHERE y.institution = t.institution) 
	GROUP BY t.tuition_type, i.url_fin_aid
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
}


/* ---- Queries here ---- */

// get Top 10 colleges by Acceptance Rate
function getTop10ByAcceptanceRate(req, res) {
  var control = req.params.control;
  var size = req.params.size;
  //var level = req.params.level;
  var region = req.params.region;
  var degUrban = req.params.degUrban;
  var sortOrder = req.params.sortOrder;

  var selectFromClause = "SELECT e.institution as InstitutionID, i.name as InstitutionName, i.url_school" + 
                        ", CONCAT(d.city, ', ', d.state) as location, e.year, sum(e.number_admitted) as number_admitted, sum(e.number_applied) as number_applied" +
                        ", CONCAT(ROUND(sum(e.number_admitted) / sum(e.number_applied), 2) * 100 , '%') as acceptance_rate" +
                        " FROM college_portal.enrollment e " +
                        " JOIN college_portal.institution i ON e.institution = i.id " + 
                        " JOIN college_portal.demographic d ON i.id = d.institution ";
  var whereClause = " WHERE e.year > 2010 AND e.year = ( " +
                    " SELECT max(enr.year) FROM college_portal.enrollment enr " +
                    " WHERE enr.institution = e.institution) " ;

  if (control.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND i.control = '${control}'`;
  }
                    
  if (size.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND i.size = '${size}'`;
  }
  
  /*
  if (level.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND i.level = "${level}"`;
  }
  */
  
  if (region.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND d.region = '${region}'`;
  }

  if (degUrban.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND d.degree_urbanization = '${degUrban}'`;
  }
  
  var groupByClause = " GROUP BY e.institution, i.name, i.url_school, CONCAT(d.city, ', ', d.state), e.year ";

  var orderByClause = `ORDER BY (sum(e.number_admitted) / sum(e.number_applied)) ${sortOrder} LIMIT 10;`;

  var query = selectFromClause + whereClause + groupByClause + orderByClause;

  console.log(query);

  console.time("getTop10ByAcceptanceRate"); 

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // console.log(rows);
      res.json(rows);
    }
  });

  console.timeEnd("getTop10ByAcceptanceRate"); 

};

// get top 10 by tution fee
function getTop10ByTutionFee(req, res) {
  var control = req.params.control;
  var size = req.params.size;
  var levelOfStudy = req.params.levelOfStudy;
  var region = req.params.region;
  var degUrban = req.params.degUrban;
  var sortOrder = req.params.sortOrder;
  var tutionType = req.params.tutionType;

	var selectFromClause = "SELECT t.institution as InstitutionID, i.name as InstitutionName, t.year " + 
                        " , CONCAT('$', FORMAT(t.tuition_fees_ft, 2))  as tuition_fee, t.tuition_type, t.level_of_study " +
                        " , i.url_school, CONCAT(d.city, ', ', d.state) as location " +
                        " , CONCAT(t.tuition_type, ', ' , t.level_of_study, ' - Tuition') as attribute1_label " + 
                        " FROM college_portal.tuition t " + 
                        " JOIN college_portal.institution i ON t.institution = i.id " +
                        " JOIN college_portal.demographic d ON i.id = d.institution " ;

  var whereClause = " WHERE t.tuition_fees_ft <> 0 " + 
                  " AND t.year = ( SELECT max(tut.year) FROM college_portal.tuition tut " + 
                  " WHERE tut.institution = t.institution ) ";

  if (levelOfStudy.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND t.level_of_study = "${levelOfStudy}"`;
  }

  if (tutionType.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND t.tuition_type = "${tutionType}"`;
  }

  if (control.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND i.control = '${control}'`;
  }
                    
  if (size.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND i.size = '${size}'`;
  }

  if (region.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND dem.region = '${region}'`;
  }

  if (degUrban.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND dem.degree_urbanization = '${degUrban}'`;
  }
  
  var orderByClause = `ORDER BY t.tuition_fees_ft ${sortOrder} LIMIT 10;`;

  var query = selectFromClause + whereClause + orderByClause;
  console.log(query);

  console.time("getTop10ByTutionFee");

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  console.timeEnd("getTop10ByTutionFee"); 
}

// get top 10 by earnings
function getTop10ByEarning(req, res) {
  var control = req.params.control;
  var size = req.params.size;
  //var level = req.params.level;
  var region = req.params.region;
  var degUrban = req.params.degUrban;
  var sortOrder = req.params.sortOrder;
  var degreeLevel = req.params.degreeLevel;

  var selectFromClause = "SELECT p.institution as InstitutionID, i.name as InstitutionName " + 
                        " , m.title as Major, d.description as DegreeLevel, CONCAT('$', FORMAT(pe.earning_med, 2)) as earning_med " +
                        " , i.url_school, CONCAT(dem.city, ', ', dem.state) as location, i.data_year as year " + 
                        " FROM college_portal.program p " + 
                        " JOIN college_portal.institution i ON p.institution = i.id " +
                        " JOIN college_portal.program_debt_earning pe ON p.id = pe.program " +
                        " JOIN college_portal.major m ON p.major = m.id " +
                        " JOIN college_portal.degree_level d ON p.degree_level = d.id " +
                        " JOIN college_portal.demographic dem ON i.id = dem.institution ";

  var whereClause = " WHERE 1 = 1 " ;

  if (degreeLevel.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND d.description = "${degreeLevel}"`;
  }

  if (control.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND i.control = '${control}'`;
  }
                    
  if (size.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND i.size = '${size}'`;
  }
  /*
  if (level.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND i.level = "${level}"`;
  }
  */
  
  if (region.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND dem.region = '${region}'`;
  }

  if (degUrban.localeCompare("ALL") != 0) {
    whereClause = whereClause + ` AND dem.degree_urbanization = '${degUrban}'`;
  }
  
  var orderByClause = `ORDER BY pe.earning_med ${sortOrder} LIMIT 10`;

  var query = selectFromClause + whereClause + orderByClause + `;`;
  console.log(query);

  /*
	var query = `
      SELECT p.institution as InstitutionID, i.name as InstitutionName
      , m.title as Major, d.description as DegreeLevel, CONCAT('$', FORMAT(pe.earning_med, 2)) as earning_med 
      , i.url_school, CONCAT(dem.city, ', ', dem.state) as location, i.data_year as year
      FROM college_portal.program p
      JOIN college_portal.institution i ON p.institution = i.id
      JOIN college_portal.program_debt_earning pe ON p.id = pe.program
      JOIN college_portal.major m ON p.major = m.id
      JOIN college_portal.degree_level d ON p.degree_level = d.id 
      JOIN college_portal.demographic dem ON i.id = dem.institution
      WHERE d.description = "Master's Degree" -- input filter for degree level
      -- AND i.control = 'Public'
      -- AND i.level = 'Four or more years'
      -- AND i.size = '10,000–19,999'
      -- AND dem.region = 'Southeast: AL, AR, FL, GA, KY, LA, MS, NC, SC, TN, VA, and WV'
      -- AND d.degree_urbanization = 'City, midsize' 
      ORDER BY pe.earning_med desc
      LIMIT 10;
  `;
  */
  console.time("getTop10ByEarning");

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

  console.timeEnd("getTop10ByEarning"); 

}

// get majors dropdown list values
function getMajors(req, res) {
  var query = `
    SELECT title AS major 
    FROM college_portal.major
    ORDER BY title;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// get regions dropdown list values
function getRegions(req, res) {
	var query = `
    SELECT distinct region 
    FROM college_portal.demographic
    ORDER BY region;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// get degree of urbanization dropdown list values
function getUrbanization(req, res) {
	var query = `
    SELECT distinct degree_urbanization 
    FROM college_portal.demographic
    ORDER BY degree_urbanization;
  `;
  //console.log(query);
  
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// get degree of urbanization dropdown list values
function getDegreeLevels(req, res) {
	var query = `
    SELECT distinct description 
    FROM college_portal.degree_level
    ORDER BY description;
  `;
  //console.log(query);
  
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// get states dropdown list values
function getStates(req, res) {
	var query = `
    SELECT distinct state 
    FROM college_portal.demographic
    ORDER BY state;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// Get controls (pubic, private, etc.) dropdown list values
function getControls(req, res) {
  var query = `
    SELECT DISTINCT control
    FROM college_portal.institution
    ORDER BY control
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// Get levels (two-year, four-year, etc.) dropdown list values 
function getLevels(req, res) {
  var query = `
    SELECT DISTINCT level
    FROM college_portal.institution
    ORDER BY level
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// Get enrollment sizes dropdown list values
function getSizes(req, res) {
  var query = `
    SELECT DISTINCT size
    FROM college_portal.institution
    ORDER BY size
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// Get tuition types (in-state, etc.) dropdown list values
function getTuitiontypes(req, res) {
  var query = `
    SELECT DISTINCT tuition_type AS tuitiontype
    FROM college_portal.tuition
    ORDER BY tuitiontype
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---------------------------------------------- */
/* ------ Criteria Search Route Handlers -------- */
/* ---------------------------------------------- */

// Criteria search

function criteriaSearch(req, res) {
  if(!req.query.state) {
    res.status(400).json({
      'message': 'Incorrect query parameters passed.'
    })
  }
  var state = req.query.state;
  var control = req.query.control;
  var region = req.query.region;
  var level = req.query.level;
  var size = req.query.size;
  var tuitiontype = req.query.tuitiontype;
  var housing = req.query.housing;
  var major = req.query.major;
  var selective = req.query.selective;
  var limit = req.query.limit;

  var selectClause = `
  SELECT DISTINCT I.name, D.city, D.state, I.size, I.control, ROUND((100*E.number_admitted/E.number_applied), 0) AS selectivity, I.url_school, I.id
  FROM college_portal.institution I
  JOIN college_portal.demographic D ON I.id = D.institution
  JOIN college_portal.program P ON I.id = P.institution
  JOIN college_portal.enrollment E ON I.id = E.institution
  `;

  var whereClause = `
  WHERE P.degree_level < 8
  AND E.year = (
    SELECT MAX(year)
    FROM college_portal.enrollment
    WHERE institution = E.institution
    AND sex = 'Total'
  )
  AND E.sex = 'Total'
  `;

  var orderClause = `
  ORDER BY Name
  `;

  var limitClause = `
  LIMIT 10
  `;

  if (state.localeCompare("%") != 0) {
    whereClause = whereClause + ` AND D.state = '${state}'`;
  }

  if (control.localeCompare("%") != 0) {
    whereClause = whereClause + ` AND I.control = '${control}'`;
  }

  if (region.localeCompare("%") != 0) {
    whereClause = whereClause + ` AND D.region = '${region}'`;
  }

  if (level.localeCompare("%") != 0) {
    whereClause = whereClause + ` AND I.level = '${level}'`;
  }

  if (size.localeCompare("%") != 0) {
    whereClause = whereClause + ` AND I.size = '${size}'`;
  }

  if (housing.localeCompare("%") != 0) {
    selectClause = selectClause + ` JOIN college_portal.services S on I.id = S.institution`;
    whereClause = whereClause + ` AND S.oncampus_housing = '${housing}'`;
  }

  if (selective.localeCompare("%") != 0) {
    if (selective.localeCompare("High") == 0) {
      //Highly select code
      whereClause = whereClause + ` AND (100*E.number_admitted/E.number_applied) <= 40`;
    } else if (selective.localeCompare("Moderate") == 0) {
      //Moderate selective code
      whereClause = whereClause + ` AND (100*E.number_admitted/E.number_applied) > 40 AND (100*E.number_admitted/E.number_applied) <= 80`;
    } else {
      //Minimally selective code
      whereClause = whereClause + ` AND (100*E.number_admitted/E.number_applied) > 80`;
    }
  }

  if (tuitiontype.localeCompare("%") != 0) {
    selectClause = selectClause + ` JOIN college_portal.tuition T ON I.id = T.institution`;
    whereClause = whereClause + ` 
    AND T.level_of_study = 'Undergraduate'
    AND T.tuition_type = '${tuitiontype}'
    AND T.year = (
      SELECT MAX(year)
      FROM college_portal.tuition
      WHERE institution = T.institution
    )`;
  }

  if (major.localeCompare("%") != 0) {
    selectClause = selectClause + ` JOIN college_portal.major M ON P.major = M.id`;
    whereClause = whereClause + ` AND M.title = '${major}'`;
  }

  if (limit.localeCompare("%") != 0) {
    if (limit.localeCompare("10") == 0) {
      limitClause = `LIMIT 10`;
    } else if (limit.localeCompare("25") == 0) {
      limitClause = `LIMIT 25`;
    } else if (limit.localeCompare("50") == 0) {
      limitClause = `LIMIT 50`;
    } else {
      limitClause = `LIMIT 100`;
    }
  }

  var query = selectClause + whereClause + orderClause + limitClause +`;`;

  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Queries here ---- */
function getCollegeName(req,res) {
	var query = `SELECT i.name
	FROM college_portal.institution i 
	WHERE i.id ='${req.params.id}'
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
};

/* ---- Queries here ---- */
function getViewbookMajors(req,res) {
	var query = `SELECT DISTINCT m.title
	FROM college_portal.major m
	JOIN college_portal.program p ON m.id = p.major
	JOIN college_portal.degree_level d ON p.degree_level = d.id 
	WHERE p.institution = '${req.params.id}'
	ORDER BY m.title ASC; 
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
};



/* ---- Queries here ---- */
function getViewbookBasicInfo(req,res){
	var query = `SELECT i.name, d.address, d.state, d.city, d.zip, d.phone, d.degree_urbanization
	FROM college_portal.institution i JOIN college_portal.demographic d ON i.id = d.institution
	WHERE i.id ='${req.params.id}'
	AND i.data_year = 
	(SELECT MAX(n.data_year) 
	FROM college_portal.institution n 
	WHERE n.id = i.id)
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
};


/* ---- Queries here ---- */
function getApplicationInfo(req,res){
	var query = `SELECT CEILING(MAX((e.number_admitted / e.number_applied) * 100)) AS percent_accepted, 
	i.size, i.url_school, i.url_application
	FROM college_portal.enrollment e 
	JOIN college_portal.institution i ON e.institution = i.id
	WHERE e.institution = '${req.params.id}'
	AND e.year = 
	(SELECT MAX(f.year) 
	FROM college_portal.enrollment f 
	WHERE f.institution = e.institution) 
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
};

/* ---- Queries here ---- */
function getTuitionInfo(req,res){
	var query = `SELECT t.tuition_type, AVG(t.tuition_fees_ft) AS tuition_fees, i.url_fin_aid 
	FROM college_portal.tuition t 
	JOIN college_portal.institution i ON t.institution = i.id
	WHERE i.data_year = t.year
	AND t.institution = '${req.params.id}'
	AND t.year = 
	(SELECT MAX(y.year) 
	FROM college_portal.tuition y 
	WHERE y.institution = t.institution) 
	GROUP BY t.tuition_type, i.url_fin_aid
	`;
	connection.query(query, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			res.json(rows);
		}
	})
};

// The exported functions, which can be accessed in index.js.
module.exports = {
	//add to this as we grow
	//previous example from HW2: getAllGenres: getAllGenres,
	compareEarningsPerMajor: compareEarningsPerMajor,
  getMajors: getMajors,
	getDegreeLevels: getDegreeLevels,
	getRegions: getRegions,
	getUrbanization: getUrbanization,
	getStates: getStates,
	getControls: getControls,
	getLevels: getLevels,
	getSizes: getSizes,
	getTuitiontypes: getTuitiontypes,
	criteriaSearch: criteriaSearch,
	getTop10ByAcceptanceRate: getTop10ByAcceptanceRate,
	getTop10ByTutionFee: getTop10ByTutionFee,
  getTop10ByEarning: getTop10ByEarning,
  getDegreeLevels: getDegreeLevels,
	// getTop10ByAcceptanceRate: getTop10ByAcceptanceRate,
	// getTop10ByTutionFee: getTop10ByTutionFee,
  getTop10ByEarning: getTop10ByEarning, 
  getViewbookMajors : getViewbookMajors,
	getViewbookBasicInfo : getViewbookBasicInfo,
	getApplicationInfo : getApplicationInfo,
	getTuitionInfo : getTuitionInfo,
	getCollegeName : getCollegeName
}
