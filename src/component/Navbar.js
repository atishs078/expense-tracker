import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaMoneyBill, FaChartLine, FaFileDownload, FaUser, FaSearch, FaTasks } from 'react-icons/fa'; // Import icons from React Icons

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" style={{ background: 'linear-gradient(145deg, #6a11cb, #2575fc)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <span style={{ fontWeight: '600', fontSize: '1.5rem', color: '#fff' }}>Expense Tracker</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/">
                  <FaMoneyBill className="me-2" />
                  Expenses
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/income">
                  <FaChartLine className="me-2" />
                  Income
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/visualization">
                  <FaChartLine className="me-2" />
                  Analytics & Visualization
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/download">
                  <FaFileDownload className="me-2" />
                  Download Report
                </Link>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/profile">
                  <FaUser className="me-2" />
                  Profile
                </Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                style={{ borderRadius: '20px', border: '1px solid #555' }}
              />
              <button
                className="btn btn-outline-light"
                type="submit"
                style={{ borderRadius: '20px' }}
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Add custom CSS for hover effects */}
      <style>
        {`
          .navbar {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .nav-link {
            color: #fff !important;
            transition: all 0.3s ease;
            border-radius: 10px;
            padding: 8px 12px;
          }
          .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
          .navbar-brand {
            transition: all 0.3s ease;
          }
          .navbar-brand:hover {
            opacity: 0.8;
          }
          .btn-outline-light {
            transition: all 0.3s ease;
          }
          .btn-outline-light:hover {
            background-color: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
        `}
      </style>
    </>
  );
};

export default Navbar;