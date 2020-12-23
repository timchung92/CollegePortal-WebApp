import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    //fill in properties and state up here
   
    this.state = {

    }

  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    
  }


  /* ---- Dashboard ---- */
  /* Note - for the sake of testing, I copied html from our HW2 below. Original file was also called Dashboard. */


  render() {
    return (
      <div className="Dashboard">
        <br></br>
        <br></br>
        <br></br>
      <div className="jumbotron welcome"><div><h4>Meet Your College Match</h4></div></div>
      <div className="jumbotron subtext">
        <div>
          <p>In just two minutes and a few clicks, you can find your dream university. There are thousands of choices for the next step in your education career, and we're here to connect you with the schools that match your interests, goals, and life game-plan. Are you ready?</p>
          <br></br>
          <b>Let's Get Started!</b>
          <br></br><br></br>
          <a href="/Top10Lists"><button>Who's the Top?</button></a> &nbsp; &nbsp; &nbsp;
          <a href="/Compare-Earnings"><button>Who Earns the Most?</button></a> &nbsp; &nbsp; &nbsp;
          <a href="/CriteriaSearch"><button>Who Do I Want?</button></a>
        </div>
      </div>


      </div>
    );
  }
}