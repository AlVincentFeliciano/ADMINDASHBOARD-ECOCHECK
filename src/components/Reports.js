import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Step 1: Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        // Step 2: Set up the headers with the token
        const config = {
          headers: {
            'x-auth-token': token, // This header must match your backend's authMiddleware
          },
        };

        // Step 3: Make the GET request with the auth header
        const res = await axios.get('http://localhost:5000/api/reports', config);
        setReports(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        setError('Failed to fetch reports. Access denied.');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>All Reports</h3>
      <ul>
        {reports.length > 0 ? (
          reports.map((report) => (
            <li key={report._id}>
              <p>Description: {report.description}</p>
              <p>Status: {report.status}</p>
            </li>
          ))
        ) : (
          <p>No reports found.</p>
        )}
      </ul>
    </div>
  );
};

export default Reports;