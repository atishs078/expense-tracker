import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import Expense from './Expense';
import Loader from './Loader';
const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login')
    }

  }, []);
  return (
    <div>
    
      <Expense/>
    </div>
  )
}

export default Home
