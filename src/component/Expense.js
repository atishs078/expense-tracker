import React, { useState, useContext, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import hostContext from '../context/HostContext';
import { useNavigate } from 'react-router-dom';
import { Chart, PieController, ArcElement, CategoryScale, Tooltip, Legend } from 'chart.js';
import Loader from './Loader';
Chart.register(PieController, ArcElement, CategoryScale, Tooltip, Legend);

const Expense = () => {
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState([]);
    const [userIncomeDate, setUserIncomeData] = useState([]);
    const [credential, setCredential] = useState({ amount: '', category: '', date: '' });
    const [aggregation, setAggregation] = useState('');
    const context = useContext(hostContext);
    const { host } = context;
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const ref = useRef(null);
    const refClose = useRef(null);
    const [value, setValue] = useState({ category: '', minimumPrice: null, maximumPrice: null, fromDate: '', toDate: '' });
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('authToken')) {
            navigate('/login');
        }
        getDetails();
        fetchUserData();
        fetchUserIncomeData();
    }, []);

    useEffect(() => {
        if (userData.length > 0 && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy existing chart instance if it exists
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }

            // Group expenses by category
            const categoryTotals = userData.reduce((acc, expense) => {
                if (!acc[expense.category]) {
                    acc[expense.category] = 0;
                }
                acc[expense.category] += parseFloat(expense.expense || 0);
                return acc;
            }, {});

            const data = {
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        data: Object.values(categoryTotals),
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FFCD56', '#4BC0C0', '#FF6384', '#36A2EB'
                        ],
                        hoverBackgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FFCD56', '#4BC0C0', '#FF6384', '#36A2EB'
                        ],
                    },
                ],
            };

            const options = {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        enabled: true,
                    },
                },
            };

            // Create new chart instance
            chartRef.current.chart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: options,
            });
        }
    }, [userData]);

    const getDetails = async () => {
        const response = await fetch(`${host}api/user/getUserDetails`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ _id: userId }),
        });
        const jsonResponse = await response.json();
        setEmail(jsonResponse.email);
    };

    const handelOnSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}api/expense/addExpense`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                email,
                expense: credential.amount,
                category: credential.category,
                expenseDate: credential.date,
            }),
        });
        const jsonResponse = await response.json();
        alert(jsonResponse.message);
        setCredential({ amount: '', category: '', date: '' });
        fetchUserData();
    };

    const handelOnChange = (e) => {
        setCredential({
            ...credential,
            [e.target.name]: e.target.value,
        });
    };

    const handelOnChange2 = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    const totalExpense = userData.reduce((total, expense) => total + parseFloat(expense.expense || 0), 0);
    const totalIncome = userIncomeDate.reduce((total, income) => total + parseFloat(income.income || 0), 0);
    const Aggregation = totalExpense;

    const fetchUserData = async () => {
        setLoading(true)
        try{
        const response = await fetch(`${host}api/expense/getPreviousExpenses`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        const jsonResponse = await response.json();
        const sortedData = jsonResponse.message.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));
        setUserData(sortedData);
    }catch(err){
        console.log("Something went wrong")

    }finally{
        setLoading(false)

    }
    };

    const fetchUserIncomeData = async () => {
        const response = await fetch(`${host}api/income/getTotalIncome`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        const jsonResponse = await response.json();
        const sortedData = jsonResponse.message.sort((a, b) => new Date(a.incomeDate) - new Date(b.incomeDate));
        setUserIncomeData(sortedData);
    };

    const onApplyChangeHandler = async () => {
        const response = await fetch(`${host}api/expense/filter`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ userId, category: value.category, minimumPrice: value.minimumPrice, maximumPrice: value.maximumPrice, fromDate: value.fromDate, toDate: value.toDate })
        });
        const jsonResponse = await response.json();
        setUserData(jsonResponse);
        refClose.current.click();
    };

    return (
        <>
            <Navbar />
            {loading?(<Loader/>):(
           
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card shadow-sm p-4 border-0" style={{ borderRadius: '15px', background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                            <h2 className="text-center mb-4" style={{ color: '#333', fontWeight: '600' }}>Add Your Expenses</h2>
                            <form onSubmit={handelOnSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="amount" className="form-label" style={{ color: '#555', fontWeight: '500' }}>Enter Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="amount"
                                        value={credential.amount}
                                        onChange={handelOnChange}
                                        id="amount"
                                        placeholder="Enter an Amount"
                                        required
                                        style={{ borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label" style={{ color: '#555', fontWeight: '500' }}>Select Category</label>
                                    <select
                                        className="form-select"
                                        name="category"
                                        value={credential.category}
                                        onChange={handelOnChange}
                                        id="category"
                                        required
                                        style={{ borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Food">Food</option>
                                        <option value="Fuel">Fuel</option>
                                        <option value="Health">Health</option>
                                        <option value="Education">Education</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Social Life">Social Life</option>
                                        <option value="Pets">Pets</option>
                                        <option value="Culture">Culture</option>
                                        <option value="Apparel">Apparel</option>
                                        <option value="Beauty">Beauty</option>
                                        <option value="Gift">Gift</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="date" className="form-label" style={{ color: '#555', fontWeight: '500' }}>Select Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="date"
                                        value={credential.date}
                                        onChange={handelOnChange}
                                        id="date"
                                        required
                                        style={{ borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100" style={{ borderRadius: '10px', padding: '10px', fontWeight: '600', background: 'linear-gradient(145deg, #6a11cb, #2575fc)', border: 'none' }}>Add Expense</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <h2 className="text-center" style={{ color: '#333', fontWeight: '600' }}>Your Previous Expenses</h2>
                    {value.category ? (
                        <p style={{ color: '#333', fontWeight: '500', textAlign: 'center' }}> Your Expense On {value.category}: {totalExpense} </p>
                    ) : (
                        <p style={{ color: '#333', fontWeight: '500', textAlign: 'center' }}> Your Total Expense : {totalExpense} </p>
                    )}

<button
  ref={ref}
  className="btn btn-primary d-block mx-auto"
  data-bs-toggle="modal"
  data-bs-target="#exampleModal"
  style={{ 
    width: '355px',
    height:'43px',
    borderRadius: '10px',
    padding: '10px', 
    fontWeight: '600', 
    background: 'linear-gradient(145deg, #6a11cb, #2575fc)', 
    border: 'none' 
  }}
>
  Add Filters
</button>
                    <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content" style={{ borderRadius: '15px' }}>
                                <div className="modal-header bg-primary text-white" style={{ borderRadius: '15px 15px 0 0' }}>
                                    <h5 className="modal-title" id="exampleModalLabel">Add Filters</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <label htmlFor="category" className="form-label">Select Category</label>
                                                <select
                                                    className="form-select"
                                                    name="category"
                                                    value={value.category}
                                                    onChange={handelOnChange2}
                                                    id="category"
                                                    required
                                                    style={{ borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Food">Food</option>
                                                    <option value="Fuel">Fuel</option>
                                                    <option value="Health">Health</option>
                                                    <option value="Education">Education</option>
                                                    <option value="Travel">Travel</option>
                                                    <option value="Social Life">Social Life</option>
                                                    <option value="Pets">Pets</option>
                                                    <option value="Culture">Culture</option>
                                                    <option value="Apparel">Apparel</option>
                                                    <option value="Beauty">Beauty</option>
                                                    <option value="Gift">Gift</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="min" className="form-label">Minimum Price</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Min Price"
                                                    name="minimumPrice"
                                                    id="min"
                                                    onChange={handelOnChange2}
                                                    value={value.minimumPrice}
                                                    style={{ borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="max" className="form-label">Maximum Price</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter Max Price"
                                                    name="maximumPrice"
                                                    id="max"
                                                    onChange={handelOnChange2}
                                                    value={value.maximumPrice}
                                                    style={{ borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="fromDate" className="form-label">From Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="fromDate"
                                                    name="fromDate"
                                                    onChange={handelOnChange2}
                                                    value={value.fromDate}
                                                    style={{ borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="toDate" className="form-label">To Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="toDate"
                                                    name="toDate"
                                                    onChange={handelOnChange2}
                                                    value={value.toDate}
                                                    style={{ borderRadius: '10px', border: '1px solid #ddd', padding: '10px' }}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose} style={{ borderRadius: '10px', padding: '10px', fontWeight: '600' }}>Close</button>
                                    <button type="button" onClick={onApplyChangeHandler} className="btn btn-primary" style={{ borderRadius: '10px', padding: '10px', fontWeight: '600', background: 'linear-gradient(145deg, #6a11cb, #2575fc)', border: 'none' }}>Apply Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-6">
                            <div className="card shadow-sm  border-0" style={{ borderRadius: '15px', background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                                <h3 className="text-center p-1 mb-4  " style={{ color: 'white', height:'43px',borderRadius:'10px',fontWeight: '600', background:'linear-gradient(145deg, #6a11cb, #2575fc)' }}>Expense Distribution
                                   
                                </h3>
                                <canvas ref={chartRef}></canvas>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="table-responsive">
                                <table
                                    className="table table-hover table-bordered scrollable-table"
                                    style={{ borderRadius: '15px', overflow: 'hidden' }}
                                >
                                    <thead className="table-dark" style={{
                                        background: 'linear-gradient(145deg, #6a11cb, #2575fc)',
                                        display: 'table',
                                        width: 'calc(100% )' // Adjust for scrollbar
                                    }}>
                                        <tr >
                                            <th style={{ width: '10%', background:'linear-gradient(145deg, #6a11cb, #2575fc)' }}>#</th>
                                            <th style={{ width: '30%' , background:'linear-gradient(145deg, #6a11cb, #2575fc)'}}>Category</th>
                                            <th style={{ width: '30%' , background:'linear-gradient(145deg, #6a11cb, #2575fc)'}}>Expense</th>
                                            <th style={{ width: '30%' , background:'linear-gradient(145deg, #6a11cb, #2575fc)'}}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{
                                        display: 'block',
                                        maxHeight: '669px', // 16 rows * 30px (approx)
                                        overflowY: 'auto',
                                    }}>
                                        {userData.map((expense, index) => (
                                            <tr
                                                key={expense._id}
                                                style={{
                                                    transition: 'all 0.3s ease',
                                                    display: 'table',
                                                    width: '100%'
                                                }}
                                            >
                                                <td style={{ width: '10%' }}>{index + 1}</td>
                                                <td style={{ width: '30%' }}>{expense.category}</td>
                                                <td style={{ width: '30%' }}>{expense.expense}</td>
                                                <td style={{ width: '30%' }}>{new Date(expense.expenseDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <style>{`
.scrollable-table {
    table-layout: fixed;
    width: 100%;
}

/* Fix header alignment */
.table-responsive {
    overflow-x: visible;
}

/* Optional: Custom scrollbar styling */
tbody::-webkit-scrollbar {
    width: 8px;
}
tbody::-webkit-scrollbar-track {
    background: #f1f1f1;
}
tbody::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}
tbody::-webkit-scrollbar-thumb:hover {
    background: #555;
}
`}</style>
                    </div>
                </div>
            </div>
            )}
        </>
    );
};

export default Expense;