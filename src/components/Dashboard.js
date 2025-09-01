// /src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import auth from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await auth.getToken();
        if (!token) throw new Error('No token found. Please log in.');

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/reports', config);

        if (Array.isArray(res.data)) setReports(res.data);
        else setReports([]);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError('Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Update report status in backend
  const handleStatusChange = async (reportId, newStatus) => {
    // Optimistically update UI
    const previousReports = [...reports];
    setReports((prev) =>
      prev.map((report) =>
        (report._id || report.id) === reportId ? { ...report, status: newStatus } : report
      )
    );

    try {
      const token = await auth.getToken();
      if (!token) throw new Error('No auth token found');

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { status: newStatus };

      await axios.put(`http://localhost:5000/api/reports/${reportId}/status`, body, config);
    } catch (err) {
      console.error('Status update error:', err.response?.data || err.message);
      alert('Failed to update report status. Reverting...');
      // Revert UI if backend fails
      setReports(previousReports);
    }
  };

  const handleLogout = () => {
    auth.removeToken();
    navigate('/login');
  };

  if (loading) return <div className="container mt-5">Loading reports...</div>;
  if (error) return <div className="container mt-5 text-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>

      {reports.length === 0 && <p>No reports found.</p>}

      <div className="row g-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {reports.map((report) => {
          const reportId = report._id || report.id;
          return (
            <div key={reportId || Math.random()} className="col-md-4">
              <div className="card shadow-sm h-100">
                {report.photoUrl ? (
                  <img
                    src={report.photoUrl.startsWith('http') ? report.photoUrl : `http://localhost:5000${report.photoUrl}`}
                    className="card-img-top"
                    alt="Report"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ height: '200px', backgroundColor: '#ddd' }} />
                )}

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{report.name || 'Unknown'}</h5>
                  <p className="card-text"><strong>Contact:</strong> {report.contact || 'N/A'}</p>
                  <p className="card-text"><strong>Description:</strong> {report.description || 'N/A'}</p>
                  <p className="card-text"><strong>Location:</strong> {report.location || 'N/A'}</p>
                  <p><strong>Reported on:</strong> {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}</p>

                  <div className="mt-auto">
                    <label><strong>Status:</strong></label>
                    <select
                      className="form-select mt-1"
                      value={report.status || 'Pending'}
                      onChange={(e) => handleStatusChange(reportId, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="On Going">On Going</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
