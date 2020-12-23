import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/NextStepsText.css';

export default class NextStepsText extends React.Component {
	constructor(props) {
        super(props);
        
        this.state = {
            text: "",
            infos: this.props.infos,
            isProfShowing: false,
            isJohnShowing: false,
            isJaneShowing: false        
        }

        this.loadProfessor = this.loadProfessor.bind(this);
        this.loadJohn = this.loadJohn.bind(this);
        this.loadJan = this.loadJan.bind(this);
    }
    
    loadProfessor() {
        var localText = "Hi there! My name is Professor Davis. I am a professor in the Anthropology department. I have been here for 15 years and am tenure-track. I enjoy teaching all subjects in my field, ranging from large introductory lecture hall courses to the smaller, more intimate senior seminars. As much as I love working on my own research, it is exciting to see my students initiate their own research topics and think about how to advance the field. When I am not teaching, I enjoy watching my teenagers' various sports games.";

        this.setState({
            text: localText,
            isProfShowing: true,
            isJohnShowing: false,
            isJaneShowing: false
        })
    }

    loadJohn() {
        var johnText = "Nice to meet you! My name is Martin. I am a Senior with double majors in Math and International Economics. I am an out-of-state student and have a work-study job in addition to a merit scholarship, so I’m happy to talk about the financial aid process if you have questions about affordability. The Math department has a lot of connections to financial firms in the area, and I was able to get course credit for an accountancy internship during my junior year. This past summer, I got the chance to travel with other students in my International Economics programs to teach microfinance courses to students in Ghana. I have a variety of interests and I’m grateful that I’m able to pursue all of them here! ";
        
        this.setState({
            text: johnText,
            isProfShowing: false,
            isJohnShowing: true,
            isJaneShowing: false
        })

    }

    loadJan() {
        var localText = "Hi! My name is Stephanie. I am a member of the class of 2023 and am currently an undecided science major. Luckily, the school of science has room to explore the different majors available, so I plan to meet with my academic advisor next semester and make a decision. I grew up twenty minutes away from campus and have dreamed of coming here my entire life. I write for the school newspaper and a member of the Alpha Phi sorority. My friends and I like to go to the hockey and basketball games – the teams are really good.";
        
        this.setState({
            text: localText,
            isProfShowing: false,
            isJaneShowing: true,
            isJohnShowing: false
        })
    }

	render() {
            return (
                <div className="emailText">
                    <br></br>
                    <h3>Like what you see so far?</h3>
                    <br></br>
                    <h4>We’re glad you’re interested in this school! Let's meet your future community! </h4>
                    <p>We're a vibrant community made up of highly-accomplished professors who are specialists in their field, intellectually-engaged and service-minded students, and more. Clink on the cards below to get to know us more! </p>

                    <div className="card-section">
                        <div className="column">
                            <div class="card" onClick={this.loadProfessor}>
                                    <h5><b>Prof Jane</b></h5>
                                    <p>Professor</p>
                            </div>
                        </div>
                        <div className="column">
                            <div class="card" onClick={this.loadJohn}>
                                <div>
                                    <h5><b>John Doe</b></h5>
                                 <p>Student</p>
                                </div>
                            </div>
                        </div>
                        <div className="column">
                            <div class="card" onClick={this.loadJan}>
                                <div>
                                    <h5><b>Jan Doe</b></h5>
                                    <p>Student</p>
                                </div>
                            </div>
                        </div>
                        <br></br>
                    </div>
                    <div>
                        <br></br>
                            <p>{this.state.text}</p>
                            <div> {
                                this.state.isProfShowing &&
                                <img class="prof-card" src={require('./campus_photos/professor_british.jpg')} alt="Avatar"/>}
                                </div>
                            </div>
                            <div>
                            {
                                this.state.isJohnShowing &&
                                <img class="john-card" src={require('./campus_photos/uganda.jpg')} alt="Avatar"/>}
                            </div>
                            <div>{
                                this.state.isJaneShowing &&
                                <img class="jan-card" src={require('./campus_photos/senior_portrait.jpg')} alt="Avatar"/>}
                                </div>
                </div>
            );

	}
}
