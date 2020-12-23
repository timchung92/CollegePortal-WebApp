import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Top10 from './Top10Lists';
import CompareEarningsJob from './CompareEarningsJob'
import CollegeViewbook from './CollegeViewbook';
import CriteriaSearch from './CriteriaSearch';

export default class App extends React.Component {

/* The below may evolve over time. Just getting app running for now. */

  render(){
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route
              exact
              path = "/"
              render = {() => (
                <Dashboard/>
              )}
              />
            <Route
            exact
            path = "/dashboard"
            render = {() => (
              <Dashboard/>
            )}
            />
            <Route
            exact
            path = "/Top10Lists"
            render = {() => (
              <Top10/>
            )}
            />
             <Route
            exact
            path = "/Compare-Earnings"
            render = {() => (
              <CompareEarningsJob/>
            )}
            />
            <Route
            exact 
            path = "/viewbook"
            render = {() => (
              <CollegeViewbook/>
            )}
            />
            <Route
            exact 
            path = "/CriteriaSearch"
            render = {() => (
              <CriteriaSearch/>
            )}
            />
          </Switch>
        </Router>
      </div>
    )
  }
}

/* Below is code that automatically came with React project. Keeping here just in case for now. */

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This is where the college app will go. 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/