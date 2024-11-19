import React, { useState, useEffect } from 'react';
import { fetchUserTests } from '../services/apiServices'; // Adjust this import to your actual API call
import { useNavigate } from 'react-router-dom';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [currentTestLink, setCurrentTestLink] = useState(''); // State to hold the current test link
  const navigate = useNavigate();

  // Fetch user tests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUserTests();
        setTests(response.data || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchData();
  }, []);

  const handleViewTest = (testID) => {
    setCurrentTestLink(`localhost:3000/test/${testID}`); // Set the current test link
    setModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <div className="test-form">
      <h2>Tests Created by You</h2>
      <table className="test-table">
        <thead>
          <tr>
            <th>Test No</th>
            <th>Test Title</th>
            <th>Date Created</th>
            <th>Test Link</th>
            <th>Actions</th>
            <th>Edit test</th>
          </tr>
        </thead>
        <tbody>
          {tests.length ? (
            tests.map((test, index) => (
              <TestRow 
                key={test.Test_ID} 
                test={test} 
                testNumber={index + 1} 
                handleViewTest={handleViewTest} 
                navigate={navigate} 
              />
            ))
          ) : (
            <tr>
              <td colSpan="5">No tests found</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalVisible && ( // Conditional rendering of the modal
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>Test Link</h3>
            <p>{currentTestLink}</p>
            <a href={currentTestLink} target="_blank" rel="noopener noreferrer">Open Test</a>
          </div>
        </div>
      )}

      <style jsx>{styles}</style>
    </div>
  );
};

const TestRow = ({ test, testNumber, handleViewTest, navigate }) => (
  <tr className="test-row">
    <td>{testNumber}</td>
    <td>{test.test_title}</td>
    <td>{new Date(test.created_at).toLocaleDateString("en-US", {
          weekday: "long",   // "long" for full name (e.g., Monday), "short" for abbreviated (e.g., Mon)
          year: "numeric",   // "numeric" shows full year (e.g., 2024)
          month: "long",     // "long" shows full month (e.g., October), "short" for abbreviated (e.g., Oct)
          day: "numeric"     // "numeric" shows the day (e.g., 15)
        })}</td>
    <td>
      <button onClick={() => handleViewTest(test.Test_ID)}>Link</button> {/* Use button to trigger modal */}
    </td>
    <td>
      <button onClick={() => navigate(`/test/${test.Test_ID}`)}>
      Quiz
      </button>
    </td>
    <td>
      <button onClick={() => navigate(`/edit-test/${test.Test_ID}`)}>
        edit
      </button>
    </td>
  </tr>
);

const styles = `
  .test-form {
   
    margin: 20px auto;
    max-width: 800px;
    text-align: center;
    font-family: Arial, sans-serif;
    background-color: #dfe6e9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h2 {
    margin-bottom: 20px;
    color: #333;
  }

  .test-table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse; /* No space between cells */
  }

  th, td {
    padding: 12px;
    text-align: left; /* Align text to the left */
  }

  th {
    background-color: #386a6a;
    color: white;
  }

  .test-row:hover {
    background-color: #dfe6e9;
  }

  button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background-color: #386a6a;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #3fa4a4;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Higher z-index to overlay other content */
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px; /* Width of the modal */
    text-align: center;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

export default TestList;
