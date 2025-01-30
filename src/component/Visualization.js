import React, { useEffect, useState, useContext } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import hostContext from '../context/HostContext';
import Loader from './Loader';

const Visualization = () => {
    const [userData, setUserData] = useState([]);
    const navigate = useNavigate();
    const context = useContext(hostContext);
    const { host } = context;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (!localStorage.getItem('authToken')) {
            navigate('/login');
        }
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setLoading(true)
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`${host}api/expense/getPreviousExpenses`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            const jsonResponse = await response.json();
            const sortedData = jsonResponse.message.sort((a, b) => new Date(a.expenseDate) - new Date(b.expenseDate));
            setUserData(sortedData);
        } catch (error) {

        }
        finally {
            setLoading(false)
        }

    };

    const categoryData = userData.reduce((acc, expense) => {
        const existing = acc.find((item) => item.name === expense.category);
        if (existing) {
            existing.value += expense.expense;
        } else {
            acc.push({ name: expense.category, value: expense.expense });
        }
        return acc;
    }, []);

    const monthlyData = userData.reduce((acc, expense) => {
        const date = new Date(expense.expenseDate);
        const month = date.toLocaleString('default', { month: 'long' });
        const existing = acc.find((item) => item.month === month);
        if (existing) {
            existing.total += expense.expense;
        } else {
            acc.push({ month, total: expense.expense });
        }
        return acc;
    }, []);

    return (
        <>
            <Navbar />
            {loading ? (<Loader />) : (
                <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Expense Visualization</h1>

                    {/* Pie Chart for Category Distribution */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 ">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Category Distribution</h3>
                        <div className="flex justify-center">
                            <PieChart width={400} height={300}>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    label
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>

                    {/* Bar Chart for Monthly Expenses */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8 ">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Monthly Expenses</h3>
                        <div className="flex justify-center">
                            <BarChart width={600} height={300} data={monthlyData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" fill="#82ca9d" />
                            </BarChart>
                        </div>
                    </div>

                    {/* Line Chart for Expense Trends */}
                    {/* Line Chart for Expense Trends */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Expense Trends Over Time</h3>
                        <div className="flex justify-center">
                            <LineChart width={600} height={300} data={
                                userData.reduce((acc, expense) => {
                                    const dateStr = new Date(expense.expenseDate).toLocaleDateString();
                                    const existing = acc.find(item => item.date === dateStr);
                                    if (existing) {
                                        existing.total += expense.expense;
                                    } else {
                                        acc.push({ date: dateStr, total: expense.expense });
                                    }
                                    return acc;
                                }, []).sort((a, b) => new Date(a.date) - new Date(b.date))
                            }>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={{ fill: '#8884d8', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Visualization;