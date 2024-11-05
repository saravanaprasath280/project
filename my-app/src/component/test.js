import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetQuestions,PushQuestion } from '../services/apiServices';

const LoginPage = () => {
    const [responses, setResponses] = useState([]);  // Track all responses
    const [activeForm, setActiveForm] = useState('student');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);  // for multiple response
    const { id } = useParams();
    const navigate = useNavigate();
    const timeLimit = 5 * 60;

    const [timer, setTimer] = useState(timeLimit);
    const [timerInterval, setTimerInterval] = useState(null);

    const handleStudentClick = () => {
        setActiveForm('student');
    };

    const handleAdminClick = () => {
        setActiveForm('admin');
    };

    const handleStartTest = async () => {
        if (!name) {
            alert('Please enter your name');
            return;
        }

        setLoading(true);
        try {
            setActiveForm('test');
            const result = await GetQuestions(id);
            setQuestions(result);
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setSelectedOptions([]);  // reset multiple responses

            setTimer(timeLimit);
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        alert('Time is up!');
                        window.location.reload();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerInterval(interval);
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    };

    const checkAnswerCorrectness = (currentQuestion, answer) => {
        // Log the answer provided
        console.log("User Answer:", answer);
        
        // Ensure answer is treated as an array
        const answerArray = Array.isArray(answer) ? answer : [answer];
        alert("Answer Array: " + answerArray);
    
        // Log the format of correct_answer received
        console.log("Raw Correct Answer:", currentQuestion.correct_answer);
    
        // Declare correctAnswerArray to store parsed answers
        let correctAnswerArray;
    
        // Parse correct_answer if it's a string array representation, otherwise wrap it in an array
        if (currentQuestion.question_type === "multipleresponse" && currentQuestion.correct_answer.startsWith("[")) {
            correctAnswerArray = JSON.parse(currentQuestion.correct_answer.replace(/'/g, '"'));
        } else {
            correctAnswerArray = [currentQuestion.correct_answer];
        }
    
        alert("Correct Answer Array: " + correctAnswerArray);
        console.log("Parsed Correct Answer Array:", correctAnswerArray);

        
    
        // Check if every answer is in the correct answer list and vice versa
        const isCorrect = answerArray.length === correctAnswerArray.length &&
                          answerArray.every((ans) => correctAnswerArray.includes(ans));
    
        console.log("Final Result:", isCorrect);
        return isCorrect; // Returns true if correct, false otherwise
    };
    

    
    // const checkAnswerCorrectness = (currentQuestion, answer) => {
    //     // Log the provided answer
    //     console.log("Provided Answer:", answer);
    
    //     // Ensure answer is always treated as an array
    //     const answerArray = Array.isArray(answer) ? answer : [answer];
    //     alert("Answer Array: " + answerArray);
    
    //     // Determine the correct answer array
    //     let correctAnswerArray;
    
    //     // Check if correct_answer is a string and parse if necessary
    //     if (typeof currentQuestion.correct_answer === "string") {
    //         // Replace single quotes with double quotes for JSON compatibility
    //         const formattedString = currentQuestion.correct_answer.replace(/'/g, '"');
            
    //         try {
    //             // Parse the formatted string into an array
    //             correctAnswerArray = JSON.parse(formattedString);
    //         } catch (error) {
    //             console.error("Error parsing correct_answer:", error);
    //             return false; // Return false if parsing fails
    //         }
    //     } else if (Array.isArray(currentQuestion.correct_answer)) {
    //         correctAnswerArray = currentQuestion.correct_answer;
    //     } else {
    //         correctAnswerArray = [currentQuestion.correct_answer];
    //     }
    
    //     alert("Correct Answer Array: " + correctAnswerArray);
    //     console.log("Correct Answer Array:", correctAnswerArray);
        
    //     console.log("Answer Array:", answerArray);
    
    //     // Check if every answer is in the correct answer list and vice versa
    //     return answerArray.length === correctAnswerArray.length &&
    //         answerArray.every((ans) => correctAnswerArray.includes(ans));
    //     // Returns true if correct, false otherwise
    // };
    
    // const handleNextQuestion = () => {
    //     const currentQuestion = questions[currentQuestionIndex];
    //     const answer = currentQuestion.question_type === 'multipleresponse' ? selectedOptions : selectedOption;
    //     const isCorrect = checkAnswerCorrectness(currentQuestion, answer);
        
    //     setResponses((prevResponses) => [
    //         ...prevResponses,
    //         {
    //             question_id: currentQuestion.question_ID,
    //             answer_given: answer,
    //             is_correct: isCorrect,
    //         },
    //     ]);

    //     if (currentQuestionIndex < questions.length - 1) {
    //         setCurrentQuestionIndex((prev) => prev + 1);
    //         setSelectedOption(null);
    //         setSelectedOptions([]);
    //     } else {
    //         alert("test ends!")// handleSubmitTest(); Uncomment when implementing test submission
    //         window.location.reload();
    //     }
    // };
    
    const handleNextQuestion = async () => { 
        const currentQuestion = questions[currentQuestionIndex];
        const answer = currentQuestion.question_type === 'multipleresponse' ? selectedOptions : selectedOption;
        const isCorrect = checkAnswerCorrectness(currentQuestion, answer);
        alert(isCorrect);
    
        const response = {
            name: name,
            question_id: currentQuestion.question_ID,
            answer_given: answer,
            is_correct: isCorrect,
        };
        console.log(response);
        // Send response to backend
        try {
            const result = await PushQuestion(response);
            // await axios.post('/your-backend-endpoint', response); // Replace with your actual API endpoint
            setResponses((prevResponses) => [
                ...prevResponses,
                response,
            ]);
    
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
                setSelectedOption(null);
                setSelectedOptions([]);
            } else {
                alert("Test ends!"); 
                // Call handleSubmitTest if you want to submit the entire test
                window.location.reload();
            }
        } catch (error) {
            console.error("Error submitting response:", error);
            alert("There was an error submitting your answer. Please try again.");
        }
    };

    // const handleSubmitTest = async () => {
    //     try {
    //         await submitResponse({
    //             test_id: id,
    //             participant_name: name,
    //             responses: responses,
    //         });
    //         alert('Test submitted successfully!');
    //         navigate('/test-completed');
    //     } catch (error) {
    //         console.error('Error submitting test:', error);
    //         alert('Failed to submit test');
    //     }
    // };

    const handleCheckboxChange = (option) => {
        setSelectedOptions(prevSelectedOptions => 
            prevSelectedOptions.includes(option)
                ? prevSelectedOptions.filter(opt => opt !== option)
                : [...prevSelectedOptions, option]
        );
    };

    useEffect(() => {
        return () => {
            clearInterval(timerInterval);
        };
    }, [timerInterval]);

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div style={styles.container}>
            {activeForm !== 'test' && (
                <div style={styles.buttonContainer}>
                    <button
                        style={activeForm === 'student' ? styles.activeButton : styles.button}
                        onClick={handleStudentClick}
                    >
                        Student Login
                    </button>
                    <button
                        style={activeForm === 'admin' ? styles.activeButton : styles.button}
                        onClick={handleAdminClick}
                    >
                        Administration
                    </button>
                </div>
            )}

            {activeForm === 'student' && (
                <div style={styles.formContainer}>
                    <h2>Skill Test</h2>
                    <p>Enter your name</p>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        style={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button style={styles.submitButton} onClick={handleStartTest} disabled={loading}>
                        {loading ? 'Loading...' : 'Start'}
                    </button>
                </div>
            )}

            {activeForm === 'admin' && (
                <div style={styles.formContainer}>
                    <h2>Admin Panel</h2>
                    <p>Enter your password</p>
                    <input type="password" placeholder="Enter password" style={styles.input} />
                    <button style={styles.submitButton}>Login</button>
                </div>
            )}

            {activeForm === 'test' && questions.length > 0 && currentQuestion && (
                <div style={styles.testContainer}>
                    <h1>Skill test</h1>
                    <h2>Question ID:{currentQuestion.question_ID}</h2>
                    <h2>Answer:{currentQuestion.correct_answer}</h2>
                    <h3>Time Remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</h3>
                    <h2>{currentQuestionIndex + 1}. {currentQuestion.question}</h2>
                    
                    <div style={styles.optionContainer}>
                        {currentQuestion.question_type === 'multiplechoice' && (
                            Array.isArray(currentQuestion.options)
                                ? currentQuestion.options
                                : JSON.parse(currentQuestion.options.replace(/'/g, '"'))
                        ).map((option, index) => (
                            <div key={index} style={styles.optionContainer}>
                                <input
                                    type="radio"
                                    id={`option-${index}`}
                                    name={`question-${currentQuestionIndex}`}
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={() => setSelectedOption(option)}
                                    style={styles.radioInput}
                                />
                                <label htmlFor={`option-${index}`} style={styles.optionLabel}>
                                    {option}
                                </label>
                            </div>
                        ))}

                        {currentQuestion.question_type === 'multipleresponse' && (
                            Array.isArray(currentQuestion.options)
                                ? currentQuestion.options
                                : JSON.parse(currentQuestion.options.replace(/'/g, '"'))
                        ).map((option, index) => (
                            <div key={index} style={styles.optionContainer}>
                                <input
                                    type="checkbox"
                                    id={`checkbox-option-${index}`}
                                    value={option}
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                    style={styles.checkboxInput}
                                />
                                <label htmlFor={`checkbox-option-${index}`} style={styles.optionLabel}>
                                    {option}
                                </label>
                            </div>
                        ))}

                        {currentQuestion.question_type === 'truefalse' && (
                            <div>
                                <div style={styles.optionContainer}>
                                    <input
                                        type="radio"
                                        id="true-option"
                                        name={`question-${currentQuestionIndex}`}
                                        value="True"
                                        checked={selectedOption === "True"}
                                        onChange={() => setSelectedOption("True")}
                                    />
                                    <label htmlFor="true-option">True</label>
                                </div>
                                <div style={styles.optionContainer}>
                                    <input
                                        type="radio"
                                        id="false-option"
                                        name={`question-${currentQuestionIndex}`}
                                        value="False"
                                        checked={selectedOption === "False"}
                                        onChange={() => setSelectedOption("False")}
                                    />
                                    <label htmlFor="false-option">False</label>
                                </div>
                            </div>
                        )}

                        {currentQuestion.question_type === 'fillintheblank' && (
                            <input
                                type="text"
                                placeholder="Enter your answer"
                                style={styles.input}
                                value={selectedOption || ''}
                                onChange={(e) => setSelectedOption(e.target.value)}
                            />
                        )}
                    </div>
                    <button onClick={handleNextQuestion} style={{
                        backgroundColor: '#4CAF50',  // Green background
                        color: 'white',               // White text
                        padding: '10px 20px',         // Padding for size
                        fontSize: '16px',             // Font size
                        border: 'none',               // No border
                        borderRadius: '5px',          // Rounded corners
                        cursor: 'pointer',            // Pointer cursor on hover
                    }}>Next Question</button>
                </div>
            )}
        </div>
    );
};


const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        buttonContainer: {
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
        },
        activeButton: {
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            cursor: 'pointer',
            backgroundColor: '#4caf50',
            color: '#fff',
        },
        formContainer: {
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fff',
        },
        input: {
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            margin: '10px 0',
            border: '1px solid #ddd',
            borderRadius: '5px',
        },
        submitButton: {
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#4caf50',
            color: '#fff',
        },
        testContainer: {
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
        },
        optionContainer: {
           
            alignItems: 'center',
            margin: '15px 8px',
        },
        radioInput: {
            marginRight: '10px',
        },
        checkboxInput: {
            marginRight: '10px',
        },
        optionLabel: {
            fontSize: '16px',
        },
    };
    
export default LoginPage;
