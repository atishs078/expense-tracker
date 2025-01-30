import React, { useContext, useState } from 'react';
import hostContext from '../context/HostContext';
import Navbar from './Navbar';

const DownloadReport = () => {
  const context = useContext(hostContext);
  const [value, setValue] = useState({ fromDate: '', toDate: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { host } = context;
  const userId = localStorage.getItem('userId');

  const handelOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${host}api/expense/downloadReportofExpense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fromDate: value.fromDate, toDate: value.toDate }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `ExpenseReport_${userId}.pdf`;
        link.click();
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to download report.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onHandelChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div
              className="card shadow-sm p-4 border-0"
              style={{
                borderRadius: '15px',
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              }}
            >
              <h2
                className="text-center mb-4"
                style={{ color: '#333', fontWeight: '600' }}
              >
                Download Expense Report
              </h2>
              <form onSubmit={handelOnSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="fromDate"
                    className="form-label"
                    style={{ color: '#555', fontWeight: '500' }}
                  >
                    From Date:
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={value.fromDate}
                    onChange={onHandelChange}
                    id="fromDate"
                    className="form-control"
                    style={{ borderRadius: '10px' }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="toDate"
                    className="form-label"
                    style={{ color: '#555', fontWeight: '500' }}
                  >
                    To Date:
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={value.toDate}
                    onChange={onHandelChange}
                    id="toDate"
                    className="form-control"
                    style={{ borderRadius: '10px' }}
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                      borderRadius: '10px',
                      padding: '12px',
                      fontWeight: '600',
                      background: 'linear-gradient(145deg, #6a11cb, #2575fc)',
                      border: 'none',
                    }}
                  >
                    {loading ? 'Downloading...' : 'Download Report'}
                  </button>
                </div>
              </form>
              {error && (
                <div
                  style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}
                >
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadReport;
