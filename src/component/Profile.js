import React, { useEffect, useContext, useState } from 'react';
import hostContext from '../context/HostContext';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [credentials, setCredentials] = useState({});
    const user = localStorage.getItem('userId');
    const context = useContext(hostContext);
    const navigate = useNavigate();
    const { host } = context;
    const [loading , setLoading]=useState(false)
    useEffect(() => {
        if(!user){
            navigate('/login')
        }
        getDetails();
    }, []);

    const getDetails = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${host}api/user/getUserDetails`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ _id: user }),
            });
            const jsonResponse = await response.json();
            setCredentials(jsonResponse);
            setName(jsonResponse.uname);
            setEmail(jsonResponse.email);
            
        } catch (error) {
            console.log('Something went wrong')
        }finally{
            setLoading(false)
        }
       
    };

    const Datee = new Date(credentials.createdAt);

    const onLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <>
            <Navbar />
            {loading?(<Loader/>):(
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        <div className="card shadow-sm p-4 border-0" 
                             style={{ 
                                 borderRadius: '15px', 
                                 background: 'linear-gradient(145deg, #ffffff, #f0f0f0)'
                             }}>
                            <h2 className="text-center mb-4" style={{ color: '#333', fontWeight: '600' }}>
                                Your Profile
                            </h2>

                            <div className="row g-4">
                                {/* Name Section */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <label className="form-label" style={{ color: '#555', fontWeight: '500' }}>
                                            Your Name
                                        </label>
                                        <p className="h5" style={{ color: '#333', fontWeight: '600' }}>
                                            {name}
                                        </p>
                                    </div>
                                </div>

                                {/* Email Section */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <label className="form-label" style={{ color: '#555', fontWeight: '500' }}>
                                            Your Email
                                        </label>
                                        <p className="h5" style={{ color: '#333', fontWeight: '600' }}>
                                            {email}
                                        </p>
                                    </div>
                                </div>

                                {/* Account Created Date */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <label className="form-label" style={{ color: '#555', fontWeight: '500' }}>
                                            Account Created On
                                        </label>
                                        <p className="h5" style={{ color: '#333', fontWeight: '600' }}>
                                            {Datee.toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                </div>

                                {/* Account Created Time */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <label className="form-label" style={{ color: '#555', fontWeight: '500' }}>
                                            Account Created At
                                        </label>
                                        <p className="h5" style={{ color: '#333', fontWeight: '600' }}>
                                            {Datee.toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid gap-2 mt-4">
                                <button 
                                    onClick={onLogout}
                                    className="btn btn-primary"
                                    style={{
                                        borderRadius: '10px',
                                        padding: '12px',
                                        fontWeight: '600',
                                        background: 'linear-gradient(145deg, #6a11cb, #2575fc)',
                                        border: 'none'
                                    }}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </>
    );
};

export default Profile;