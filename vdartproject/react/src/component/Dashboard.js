/*import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard</h2>
      <p>This is where you can manage your account and settings.</p>
      
      <style jsx>{`
        .dashboard-container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
          text-align: center;
        }

        .dashboard-container h2 {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
*/
/*import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here, e.g., clear auth tokens
    // Then navigate to the login page
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {username}!</h2>
      <p>Welcome to your dashboard.</p>
      <button onClick={handleLogout}>Logout</button>

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .dashboard-container {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .dashboard-container h2 {
          margin-bottom: 20px;
        }

        button {
          background-color: #007bff;
          border: none;
          color: #fff;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
*/
/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/apiServices';
import profile from './profile-image-url.jpg';
const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      //console.log("dashboard : ",token)
      try {
        const response = await getDashboardData(token);
        setMessage(response.data.message);
      } catch (error) {
        setError('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to your dashboard!</h2>
      <p>{message || 'Loading...'}</p>
      {error && <p>{error}</p>}

    
    <a href="https://www.example.com">
  

    <div className="profile-section">
    <img src={profile} alt="Profile" className="profile-image" />
    
   </div>
   </a>
      <button onClick={handleLogout}>Logout</button>

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

     .profile-section {
      margin: 20px 0;
      text-align: center;
    }

    .profile-image {
      border-radius: 50%;
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }

        .dashboard-container {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .dashboard-container h2 {
          margin-bottom: 20px;
        }

        button {
          background-color: #007bff;
          border: none;
          color: #fff;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
*/
/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, uploadProfileImage } from '../services/apiServices'; // Update with your API service
import profile from './profile-image-url.jpg';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(profile); // Default profile image
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await getDashboardData(token);
        setMessage(response.data.message);
        // Assuming the backend provides the URL of the user's profile image
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        setError('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('access_token');
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profile_image', selectedFile);

      try {
        await uploadProfileImage(token, formData); // Implement this function in your API service
        // Optionally update the profile image URL after successful upload
        setProfileImage(URL.createObjectURL(selectedFile));
      } catch (error) {
        setError('Failed to upload image.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to your dashboard!</h2>
      <p>{message || 'Loading...'}</p>
      {error && <p>{error}</p>}

      <div className="profile-section">
        <input
          type="file"
          id="profile-image-input"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <label htmlFor="profile-image-input" style={{ cursor: 'pointer' }}>
          <img src={profileImage} alt="Profile" className="profile-image" />
        </label>
        {selectedFile && <button onClick={handleUpload}>Upload</button>}
      </div>

      <button onClick={handleLogout}>Logout</button>

      <style jsx>{`
        
      `}</style>
    </div>
  );
};

export default Dashboard;
*/
/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, uploadProfileImage } from '../services/apiServices';
import profile from './profile-image-url.jpg';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(profile); // Default profile image
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await getDashboardData(token);
        setMessage(response.data.message);
        // Assuming the backend provides the URL of the user's profile image
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        setError('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('access_token');
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profile_image', selectedFile);

      try {
        await uploadProfileImage(token, formData);
        // Optionally update the profile image URL after successful upload
        setProfileImage(URL.createObjectURL(selectedFile));
      } catch (error) {
        setError('Failed to upload image.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to your dashboard!</h2>
      <p>{message || 'Loading...'}</p>
      {error && <p className="error">{error}</p>}

      <div className="profile-section">
        <input
          type="file"
          id="profile-image-input"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <label htmlFor="profile-image-input" className="profile-image-label">
          <img src={profileImage} alt="Profile" className="profile-image" />
        </label>
        {selectedFile && <button className="upload-button" onClick={handleUpload}>Upload</button>}
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .dashboard-container {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .dashboard-container h2 {
          margin-bottom: 20px;
        }

        .profile-section {
          margin: 20px 0;
          text-align: center;
        }

        .profile-image-label {
          cursor: pointer;
          display: inline-block;
        }

        .profile-image {
          border-radius: 50%;
          width: 80px;
          height: 80px;
          margin-bottom: 10px;
          border: 2px solid #007bff;
          transition: border-color 0.3s ease;
        }

        .profile-image:hover {
          border-color: #0056b3;
        }

        .upload-button {
          background-color: #007bff;
          border: none;
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
          transition: background-color 0.3s ease;
        }

        .upload-button:hover {
          background-color: #0056b3;
        }

        .logout-button {
          background-color: #dc3545;
          border: none;
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
          transition: background-color 0.3s ease;
        }

        .logout-button:hover {
          background-color: #c82333;
        }

        .error {
          color: #dc3545;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

*/
// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getDashboardData, uploadProfileImage } from '../services/apiServices';
// import { Cropper } from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
// import profile from './profile-image-url.jpg';

// const Dashboard = () => {
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [profileImage, setProfileImage] = useState(profile); // Default profile image
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [croppedImage, setCroppedImage] = useState(null);
//   const cropperRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('access_token');
//       try {
//         const response = await getDashboardData(token);
//         setMessage(response.data.message);
//         // Assuming the backend provides the URL of the user's profile image
//         if (response.data.profileImage) {
//           setProfileImage(response.data.profileImage);
//         }
//       } catch (error) {
//         setError('Failed to fetch data.');
//       }
//     };
//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     navigate('/login');
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setSelectedFile(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCrop = () => {
//     const cropper = cropperRef.current.cropper;
//     setCroppedImage(cropper.getCroppedCanvas().toDataURL());
//   };

//   const handleUpload = async () => {
//     const token = localStorage.getItem('access_token');
//     if (croppedImage) {
//       const formData = new FormData();
//       formData.append('profile_image', croppedImage);

//       try {
//         await uploadProfileImage(token, formData);
//         setProfileImage(croppedImage);
//       } catch (error) {
//         setError('Failed to upload image.');
//       }
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <h2>Welcome to your dashboard!</h2>
//       <p>{message || 'Loading...'}</p>
//       {error && <p className="error">{error}</p>}

//       <div className="profile-section">
//         <input
//           type="file"
//           id="profile-image-input"
//           style={{ display: 'none' }}
//           accept="image/*"
//           onChange={handleFileChange}
//         />
//         <label htmlFor="profile-image-input" className="profile-image-label">
//           <img src={profileImage} alt="Profile" className="profile-image" />
//         </label>
        
//         {selectedFile && (
//           <div className="cropper-container">
//             <Cropper
//               src={selectedFile}
//               style={{ height: 400, width: '100%' }}
//               aspectRatio={1}
//               viewMode={1}
//               guides={false}
//               ref={cropperRef}
//             />
//             <button className="crop-button" onClick={handleCrop}>Crop</button>
//           </div>
//         )}

//         {croppedImage && <button className="upload-button" onClick={handleUpload}>Upload</button>}
//       </div>

//       <button className="logout-button" onClick={handleLogout}>Logout</button>

//       <style jsx>{`
//         body {
//           font-family: Arial, sans-serif;
//           background-color: #f4f4f4;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           height: 100vh;
//           margin: 0;
//         }

//         .dashboard-container {
//           background: #ffffff;
//           padding: 20px;
//           border-radius: 8px;
//           box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//           max-width: 400px;
//           width: 100%;
//           text-align: center;
//         }

//         .dashboard-container h2 {
//           margin-bottom: 20px;
//         }

//         .profile-section {
//           margin: 20px 0;
//           text-align: center;
//         }

//         .profile-image-label {
//           cursor: pointer;
//           display: inline-block;
//         }

//         .profile-image {
//           border-radius: 50%;
//           width: 80px;
//           height: 80px;
//           margin-bottom: 10px;
//           border: 2px solid #007bff;
//           transition: border-color 0.3s ease;
//         }

//         .profile-image:hover {
//           border-color: #0056b3;
//         }

//         .cropper-container {
//           margin-top: 20px;
//         }

//         .crop-button, .upload-button {
//           background-color: #007bff;
//           border: none;
//           color: #fff;
//           padding: 10px 20px;
//           border-radius: 5px;
//           cursor: pointer;
//           font-size: 16px;
//           margin-top: 10px;
//           transition: background-color 0.3s ease;
//         }

//         .crop-button:hover, .upload-button:hover {
//           background-color: #0056b3;
//         }

//         .logout-button {
//           background-color: #dc3545;
//           border: none;
//           color: #fff;
//           padding: 10px 20px;
//           border-radius: 5px;
//           cursor: pointer;
//           font-size: 16px;
//           margin-top: 20px;
//           transition: background-color 0.3s ease;
//         }

//         .logout-button:hover {
//           background-color: #c82333;
//         }

//         .error {
//           color: #dc3545;
//           margin-top: 10px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, uploadProfileImage } from '../services/apiServices'; // Updated import
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import profile from './profile-image-url.jpg'; // Replace with your default profile image URL

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(profile);
  const [selectedFile, setSelectedFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setMessage(response.data.message);
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        setError('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    setCroppedImage(cropper.getCroppedCanvas().toDataURL());
  };

  const handleUpload = async () => {
    if (croppedImage) {
      const formData = new FormData();
      formData.append('profile_image', croppedImage);

      try {
        await uploadProfileImage(formData);
        setProfileImage(croppedImage);
      } catch (error) {
        setError('Failed to upload image.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to your dashboard!</h2>
      <p>{message || 'Loading...'}</p>
      {error && <p className="error">{error}</p>}

      <div className="profile-section">
        <input
          type="file"
          id="profile-image-input"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <label htmlFor="profile-image-input" className="profile-image-label">
          <img src={profileImage} alt="Profile" className="profile-image" />
        </label>
        
        {selectedFile && (
          <div className="cropper-container">
            <Cropper
              src={selectedFile}
              style={{ height: 400, width: '100%' }}
              aspectRatio={1}
              viewMode={1}
              guides={false}
              ref={cropperRef}
            />
            <button className="crop-button" onClick={handleCrop}>Crop</button>
          </div>
        )}

        {croppedImage && <button className="upload-button" onClick={handleUpload}>Upload</button>}
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <style jsx>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .dashboard-container {
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .dashboard-container h2 {
          margin-bottom: 20px;
        }

        .profile-section {
          margin: 20px 0;
          text-align: center;
        }

        .profile-image-label {
          cursor: pointer;
          display: inline-block;
        }

        .profile-image {
          border-radius: 50%;
          width: 80px;
          height: 80px;
          margin-bottom: 10px;
          border: 2px solid #007bff;
          transition: border-color 0.3s ease;
        }

        .profile-image:hover {
          border-color: #0056b3;
        }

        .cropper-container {
          margin-top: 20px;
        }

        .crop-button, .upload-button {
          background-color: #007bff;
          border: none;
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
          transition: background-color 0.3s ease;
        }

        .crop-button:hover, .upload-button:hover {
          background-color: #0056b3;
        }

        .logout-button {
          background-color: #dc3545;
          border: none;
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
          transition: background-color 0.3s ease;
        }

        .logout-button:hover {
          background-color: #c82333;
        }

        .error {
          color: #dc3545;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
