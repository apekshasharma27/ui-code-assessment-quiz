import * as React from 'react';
import axios from 'axios';
import './Questions.css';


class Questions extends React.Component {

  state = {
    questions : [],
    count: 0,
    questTypes:[],
    correctAnswers:[],
    incorrectAnswers:[],
    multipleChoiceAnswers:[],
    selectedAnswer:"",
    correctAnswerCount:0,
    inCorrectAnswerCount:0,
    answeredCount:0,
    finalScore:0,
    showResult:false,

  }

  componentDidMount()
  {
    axios.get('http://localhost:4000/api/questions')
    .then(response =>{

      //to decode html entities in JSON
      const Entities = require('html-entities').XmlEntities;
      const entities = new Entities();

      const questionsObj = response.data.results;
      const fetchedQuestions = questionsObj.map((qObj:any) => entities.decode(qObj.question));
      const types = questionsObj.map((tObj:any)=>tObj.type);
      const correctAns= questionsObj.map((caObj:any)=>caObj.correct_answer);

      //incorrect answers array
      let icArray:any =[];
      questionsObj.map((icaObj:any)=>{
        return(icaObj.hasOwnProperty("incorrect_answers")?icArray.push(icaObj.incorrect_answers):null);
      });

      //creating mca, an array of all answers. first pushing incorrect answers
      let mca:any=[];
      questionsObj.map((x:any)=>{
       return(x.hasOwnProperty("incorrect_answers")?mca.push(x.incorrect_answers):mca.push([]));
      });

      //pushing correct answers into mca so mca has all answers
      for(let i=0;i<mca.length;i++)
      {
        mca[i].push(correctAns[i]);
      }

      this.setState({
        questions :fetchedQuestions,
        questTypes:[...types],
        correctAnswers:[...correctAns],
        incorrectAnswers:[...icArray],
        multipleChoiceAnswers:[...mca]
      });
    });
  }

  questionAnsweredHandler = ()=>{
    let ct= this.state.count;
    let ca=this.state.correctAnswerCount;
    let finScore=((ca/ct)*100).toFixed(2);

    const answer =this.state.selectedAnswer;
    let ansCount=this.state.answeredCount;
    let corAnsCt = this.state.correctAnswerCount;
    let inCorAnsCt = this.state.inCorrectAnswerCount;

    //if it is not the last question
    if(ct < 49)
    {
      this.setState({
        count:ct+1,


      });
    }
    //if it is the last question, set final score and display summary
    else
    {
      this.setState({
        showResult:true,
        finalScore:finScore
      });
    }

    //if question is answered increase count
    console.log(typeof this.state.correctAnswers[this.state.count]);

    if(answer)
    {
      this.setState({
        answeredCount:ansCount+1
      });
    }
    //if answer is same as the correct answer for this question increment correct answer count
    if(answer===this.state.correctAnswers[this.state.count])
    {
      this.setState({
        correctAnswerCount:corAnsCt+1
      });
    }
    //else increment incorrect answer count
    else
    {
      this.setState({
        inCorrectAnswerCount:inCorAnsCt+1
      });
    }
  }


  countCorrectAnswerHandler=(event:any) =>{
    const answer = event.target.value;
    this.setState({
      selectedAnswer:answer

    });


  }

//on click of restart quiz button
  restartQuizHandler=()=>{
    this.setState({
      count: 0,
      correctAnswerCount:0,
      inCorrectAnswerCount:0,
      answeredCount:0,
      finalScore:0,
      showResult:false
    })
  }

render() {
//if not last question show this
if(!this.state.showResult)
{
    return (
        <div>
          <div className="questionStyle">
          <p>{this.state.questions[this.state.count]}</p>
          </div>

          {this.state.questTypes[this.state.count]==='text'?
            <div>
              <input type="text" className="textBoxStyle" onChange={this.countCorrectAnswerHandler}/>
            </div> :null }

          {this.state.questTypes[this.state.count]==='boolean'?
          <div>
            <label className="radioStyle">
            <input type="radio" name="booleanOption" value="True"  onChange={this.countCorrectAnswerHandler} />True
            </label>
            <label className="radioStyle">
            <input type="radio" name="booleanOption" value="False" onChange={this.countCorrectAnswerHandler} />False
            </label>
          </div>:null}


          {this.state.questTypes[this.state.count]==='multiple'?
            Object.values(this.state.multipleChoiceAnswers[this.state.count]).map((m:any , index:number) =>{
              return(
                <div key={index}>
                  <label className="radioStyle">
                  <input type="radio" name="mcaOption" value={m} onChange={this.countCorrectAnswerHandler} checked={this.state.selectedAnswer=== m}/>{m}
                  </label>
                </div>

                );
                }):null}

            <div >
              <button className="buttonStyle" onClick={this.questionAnsweredHandler}>Next</button>
            </div>
          </div>);

        }
        //if last question show the summary
        else
        {
          return(
            <div className="summaryStyle">
              <h1>SUMMARY</h1>
              <div>
              <p>Correct:<span className="summaryResultStyle">{this.state.correctAnswerCount}</span></p>
              <p>Wrong:<span className="summaryResultStyle">{this.state.inCorrectAnswerCount}</span></p>
              <p>Questions answered:<span className="summaryResultStyle">{this.state.answeredCount}</span></p>
              <p>Final Score:<span className="summaryResultStyle">{this.state.finalScore}%</span></p>
              </div>
              <div>
              <button className="restartButtonStyle" onClick={this.restartQuizHandler}>Restart Quiz</button>
              </div>
            </div>
          );
        }
  }
}

export default Questions;
