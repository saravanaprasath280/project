import React, { useState, useEffect } from 'react';
import { submitQuestions2, fetchTestData} from '../services/apiServices';
// import { useNavigate } from 'react-router-dom';
import { publish } from './publish';
import { useNavigate, useParams } from 'react-router-dom';

const CreateTest = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [testTitle, setTestTitle] = useState('');
  const [testIntroduction, setTestIntroduction] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [link, setLink] = useState('');
useEffect(() => {
    const fetchData = async () => {
      if (!testId) {
        console.error('No testId provided');
        return;
      }

      try {
        const result = await fetchTestData(testId);
        if (result) {
          console.log(result)
          const { title, introduction, questions } = result;
          setTestTitle(title);
          setTestIntroduction(introduction);
          setQuestions(questions || []); // Ensure questions is an array
          console.log("data : ",testTitle,testIntroduction,questions)
        } else {
          console.error('Test data not found');
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchData();
  }, [testId]);

  
  const handleNewOptionChange = (e) => {
    setNewOption(e.target.value);
  };


  const addTrueFalseQuestion = () => {
    setQuestions([
      ...questions,
      { type: 'truefalse', text: 'Is this statement true or false?', correctAnswer: null }
    ]);
  };

  const addMultipleChoiceQuestion = () => {
    setQuestions([
      ...questions,
      { type: 'multiplechoice', text: '', options: ['', '', '', ''], correctAnswer: null }
    ]);
  };

  const addFillInTheBlankQuestion = () => {
    setQuestions([
      ...questions,
      { type: 'fillintheblank', text: '____ is the capital of France.', correctAnswer: '' }
    ]);
  };

  const addMultipleResponseQuestion = () => {
    setQuestions([
      ...questions,
      { type: 'multipleresponse', text: '', options: ['', '', '', ''], correctAnswers: [] } // Note the correctAnswers as an array
    ]);
  };
  

  const handleQuestionTextChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    if (value === '') {
      // Remove the option if the input is empty
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, index) => index !== optionIndex);
    } else {
      newQuestions[qIndex].options[optionIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const handleCorrectAnswersChange = (qIndex, optionIndex) => {
    const newQuestions = [...questions];
    const correctAnswer = newQuestions[qIndex].correctAnswer || [];
  
    if (correctAnswer.includes(optionIndex)) {
      // Remove the option if it's already selected
      newQuestions[qIndex].correctAnswer = correctAnswer.filter((index) => index !== optionIndex);
    } else {
      // Add the option to correct answers
      newQuestions[qIndex].correctAnswer = [...correctAnswer, optionIndex];
    }
  
    setQuestions(newQuestions);
  };

  // const handleCorrectAnswersChange1 = (qIndex, optionIndex) => {
  //   const newQuestions = [...questions];
  //   const question = newQuestions[qIndex];
  
  //   // Toggle optionIndex in correctAnswer
  //   if (question.correctAnswer.includes(optionIndex)) {
  //     question.correctAnswer = question.correctAnswer.filter(idx => idx !== optionIndex);
  //   } else {
  //     question.correctAnswer = [...question.correctAnswer, optionIndex];
  //   }
  
  //   setQuestions(newQuestions); // Update the state with the modified questions array
  // };
  

  const handleCorrectAnswerChange = (qIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const handleFillInTheBlankAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = value;
    setQuestions(newQuestions);
  };

  // Handle adding a new option for multiple choice questions
  const handleAddOption = (qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push(newOption);
    setQuestions(updatedQuestions);
    setNewOption(''); // Reset input field
  };
  
  const handleRemoveQuestion = (qIndex) => {
    const updatedQuestions = questions.filter((_, index) => index !== qIndex);
    setQuestions(updatedQuestions);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await submitQuestions2(testTitle,testIntroduction,questions);
      console.log('Successfully submitted:', result);
      const testId = result.test_id; 
      console.log("testid:",testId);
      const generatedLink = `http://localhost:3000/test/${testId}`;
      localStorage.setItem("testId",testId);
      setLink(generatedLink);  // Store the generated link in state
      // Redirect to another page, e.g., '/new-page'
      navigate('/publish');
      console.log(link)
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div className="test-form">
      <h1><b>Questions</b></h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group0">
          <label className="form-label">Test Name</label>
          <input
            type="text"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            placeholder="Enter test title"
            required
            className="input-field"
          />
        </div>

        <div className="form-group0">
          <label className="form-label">Introduction</label>
          <textarea
            value={testIntroduction}
            onChange={(e) => setTestIntroduction(e.target.value)}
            placeholder="Enter test introduction"
            required
            rows="3"
            className="textarea-field"
          />
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-group">
            <div className="question-content">
              <div className="question-number">{qIndex + 1}.</div>
              <textarea
                value={question.text}
                onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                placeholder={`Enter the question ${qIndex + 1} here`}
                required
                rows="2"
              />
            </div>

            <div className="form-group">
              {question.type === 'multiplechoice' && (
                <>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-group">
                      <label>
                        <input
                          type="radio"
                          name={`correctAnswer-${qIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => handleCorrectAnswerChange(qIndex, optionIndex)}
                        />
                        <input
                          type="text"
                          value={option || ''}
                          onChange={(e) => handleOptionChange(qIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </label>
                    </div>
                  ))}
                  <div className="add-option-group">
                    <input
                      type="text"
                      className="custom-input"
                      value={newOption}
                      placeholder="Add another option"
                      onClick={() => handleAddOption(qIndex)}
                      onChange={(e) => setNewOption(e.target.value)}
                    />
                    <input
                      type="text"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="custom-input-2"
                      placeholder="Remove this question"
                      readOnly
                    />
                  </div>
                </>
              )}



              {question.type === 'multipleresponse' && (
                <>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={question.correctAnswer && question.correctAnswer.includes(optionIndex)}
                          onChange={() => handleCorrectAnswersChange(qIndex, optionIndex)}
                        />
                        <input
                          type="text"
                          value={option || ''}
                          onChange={(e) => handleOptionChange(qIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </label>
                    </div>
                  ))}
                  <div className="add-option-group">
                  <input
                      type="text"
                      className="custom-input"
                      value={newOption}
                      placeholder="Add another option"
                      onClick={() => handleAddOption(qIndex)}
                      onChange={(e) => setNewOption(e.target.value)}
                      readOnly
                    />
                    <input
                      type="text"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="custom-input-2"
                      placeholder="Remove this question"
                      readOnly
                    />
                  </div>
                </>
              )}


              {question.type === 'truefalse' && (
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      name={`correctAnswer-${qIndex}`}
                      value="true"
                      checked={question.correctAnswer === true}
                      onChange={() => handleCorrectAnswerChange(qIndex, true)}
                    />
                    True
                  </label>
                  <br />
                  <label>
                    <input
                      type="radio"
                      name={`correctAnswer-${qIndex}`}
                      value="false"
                      checked={question.correctAnswer === false}
                      onChange={() => handleCorrectAnswerChange(qIndex, false)}
                    />
                    False
                  </label>
                  <br />
                  <div className="add-option-group">
                 <input
                   type="text"
                   onClick={() => handleRemoveQuestion(qIndex)}
                   className="custom-input-2"
                   placeholder="Remove this question"
                   readOnly
                 />
               </div>
                </div>
              )}

              {question.type === 'fillintheblank' && (
                <>
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) => handleFillInTheBlankAnswerChange(qIndex, e.target.value)}
                  placeholder="Answer"
                  required
                  className="input-field"
                />
                <div className="add-option-group">
                  <input
                    type="text"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="custom-input-2"
                    placeholder="Remove this question"
                    readOnly
                  />
                </div></>
              )}
            </div>

            
          </div>
        ))}

        <div className="button-group">
          <button type="button" className="add-question-btn" onClick={addTrueFalseQuestion}>
            True/False
          </button>
          <button type="button" className="add-question-btn" onClick={addMultipleChoiceQuestion}>
            Multiple Choice
          </button>
          <button type="button" className="add-question-btn" onClick={addFillInTheBlankQuestion}>
            Fill-in-the-Blank
          </button>
          <button type="button" className="add-question-btn" onClick={addMultipleResponseQuestion}>
            MultipleResponse
          </button>
          <button type="submit" className="submit-btn">
          Save
        </button>
        </div>

      </form>
      <style jsx>{`
        .test-form {
          margin-left: 225px;
          text-align: center;
          font-family: Arial, sans-serif;
          background-color: #f2f2f3;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
           width: auto;
           min-height: 699px;
        }

        .form-group0 {
          margin-bottom: 8px;
          text-align: left;
          width: 75%; /* Adjust this percentage as needed */
          margin: 0 auto; /* Center align */
        }

        .form-label {
          font-weight: bold;
          margin-bottom: 8px;
          display: block;
        }

         .input-field, .textarea-field {
          width: 100% !important;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 4px;
          border: 0px solid #ccc;
        }


        .test-form h1 {
          font-size: 2.5em;
          color: #333;
        }

        .question-group {          
          margin-top: 20px !important;
          margin-bottom: 10px !important;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          width: 75%; /* Adjust this percentage as needed */
          margin: 0 auto; 
        }

        input[type='checkbox'] {
          margin-right: 10px;
          width: 16px;
          height: 16px;
          border: 2px solid #0000FF;
          cursor: pointer;
        }

        input[type='checkbox']:checked {
          background-color: #0000FF;
        }

        
        .question-number {
          margin-right: 10px;
          font-weight: bold;
          font-size: 1.2em;
        }

         .question-content {
            display: flex;
            align-items: flex-start; /* Align text area with number */
          }

        .form-group {
          margin-bottom: 8px;
          text-align: left;
        }

        .option-group {
          display: flex;
          align-items: baseline;
          margin-bottom: 12px;
        }

        textarea {
          width: 100%;
          padding: 5px;
          margin-bottom: 12px;
          border-radius: 4px;
          border: none; /* Remove border */
          resize: none;
        }
        
        textarea:focus {
          outline: none; /* Remove the default outline */
          border: none; /* Ensure no border is applied */
        }

        textarea::placeholder,
          input[type='text']::placeholder {
          opacity: 0.5; /* Adjust opacity value as needed */
          color: #999; /* Optional: Change color of placeholder */
        }

      
        
        input[type='text'] {
          border: none; /* Remove border for text inputs */
          
        }

        input[type='text']:focus {
        
          border: none; /* Remove border for text inputs */
          outline: none;
          background-color: #f0f8ff;
        }
        .custom-input:focus {
          border: none; /* Remove border for text inputs */
          outline: none;
          background-color: transparent !important; /* Remove background color */
        }
        
        .custom-input-2:focus {
          border: none; /* Remove border for text inputs */
          outline: none;
          background-color: transparent !important; /* Remove background color */
        }
        .custom-input-2{
          float: right; /* This will align the element to the left */
          text-align: right; /* Ensure the text inside is left-aligned */
          width: auto; /* Adjust width as needed */
          margin-right: 10px; /* Add some margin if necessary */
        }

        input[type='radio'] {
          margin-right: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid #0000FF; /* Keep border for radio buttons */
          background-color: #fff;
          cursor: pointer;
        }

        input[type='radio']:checked {
          background-color: #0000FF; /* Change checked background color */
        }

        button {
         
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
        }

        button:hover {
          background-color: #0056b3;
        }

        .test-link-container {
          background-color: #f8f9fa;
          padding: 20px;
          border: 20px solid #dde9f5;
          border-radius: 8px;
          text-align: center;
          max-width: 400px;
          margin: auto;
          font-family: Arial, sans-serif;
        }

        .test-link-container p {
          font-size: 16px;
          color: #333;
          margin-bottom: 10px;
        }

        .test-link-container a {
          color: #1760c1;
          font-weight: bold;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .test-link-container a:hover {
          color: #0056b3;
          text-decoration: underline;
        }

      `}</style>
    </div>
  );
};

export default CreateTest;
