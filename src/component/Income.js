import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import hostContext from '../context/HostContext';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const Income = () => {
  const userId = localStorage.getItem('userId');
  const [email, setEmail] = useState('');
  const context = useContext(hostContext);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { host } = context;
  const [credential, setCredential] = useState({ amount: null, category: '', date: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
    getDetails();
    fetchUserData();
  }, []);

  const getDetails = async () => {
    try {
      const response = await fetch(`${host}api/user/getUserDetails`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ _id: userId }),
      });
      const jsonResponse = await response.json();
      setEmail(jsonResponse.email);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleOnChange = (e) => {
    setCredential({
      ...credential,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${host}api/income/addIncome`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          userId,
          email,
          income: credential.amount,
          category: credential.category,
          date: credential.date,
        }),
      });
      const jsonResponse = await response.json();
      alert(jsonResponse.message);
      fetchUserData();
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${host}api/income/getTotalIncome`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const jsonResponse = await response.json();
      const sortedData = jsonResponse.message.sort(
        (a, b) => new Date(a.expenseDate) - new Date(b.expenseDate)
      );
      setUserData(sortedData);
    } catch (error) {
      console.error('Error fetching income data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="card shadow-sm p-4 border-0"
                 style={{ borderRadius: '15px', background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
              <h2 className="text-center mb-4" style={{ color: '#333', fontWeight: '600' }}>
                Add Your Income
              </h2>
              <form onSubmit={handleOnSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#555', fontWeight: '500' }}>
                    Enter Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={credential.amount}
                    onChange={handleOnChange}
                    placeholder="Enter an Amount"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#555', fontWeight: '500' }}>
                    Select Category
                  </label>
                  <select className="form-select" name="category" value={credential.category} onChange={handleOnChange} required>
                    <option value="">Select Category</option>
                    <option value="Allowance">Allowance</option>
                    <option value="Salary">Salary</option>
                    <option value="Petty cash">Petty Cash</option>
                    <option value="Bonus">Bonus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#555', fontWeight: '500' }}>
                    Select Date
                  </label>
                  <input type="date" className="form-control" name="date" value={credential.date} onChange={handleOnChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 "
                        style={{ borderRadius:'10px',background: 'linear-gradient(145deg, #6a11cb, #2575fc)', border: 'none' }}>
                  Add Income
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-center" style={{ color: '#333', fontWeight: '600' }}>Your Previous Income</h2>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : userData.length > 0 ? (
            <div className="table-responsive mt-4">
              <table className="table table-hover table-bordered"
              
                    style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <thead className="table-dark">
                  <tr>
                    <th style={{background:'linear-gradient(145deg, #6a11cb, #2575fc)'}}>#</th>
                    <th style={{background:'linear-gradient(145deg, #6a11cb, #2575fc)'}}>Category</th>
                    <th style={{background:'linear-gradient(145deg, #6a11cb, #2575fc)'}}>Income</th>
                    <th style={{background:'linear-gradient(145deg, #6a11cb, #2575fc)'}}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((income, index) => (
                    <tr key={income._id}>
                      <td>{index + 1}</td>
                      <td>{income.category}</td>
                      <td>₹{income.income}</td>
                      <td>{new Date(income.incomeDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end mt-4">
                <h3 className="text-success">
                  Total Income: ₹{userData.reduce((total, income) => total + parseFloat(income.income || 0), 0)}
                </h3>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted">No income records found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Income;
