import React from 'react'
import { useEffect, useState, useRef } from 'react';
import {Link} from 'react-router-dom'
import bootbox from 'bootbox';
import axios from 'axios';

export default function ResetPassword() {
  const [emailID, setEmailID] = useState('')
  console.log(emailID)

  async function handleSubmit(e) {
    e.preventDefault();
    const Response = await axios.post('/mongoDB/forgotPassword', {email: emailID});
    if (Response.data.error === "User Does Not Exists. Please Register.") {
      bootbox.alert(Response.data.error)
      setEmailID('')
    }
    else {
      bootbox.alert("Thank you. Please check your email to Reset Password")
    }
  }
  return (
    <div className='resetpassword'>
    <Link to='/'><button type='button' className='btn-back-to-login'> Back To Login  </button> </Link>
    <form onSubmit={handleSubmit} className="reset-form">
      <h2> Forgot Password?</h2>

      <div className='mb-3'>
        <label> Email Address: </label>
        <input type="email"
          className="reset-email"
          placeholder="Enter Email"
          onChange = { (e) => setEmailID(e.target.value) }
          />
      </div>
      <div className='d-grid'>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </div>
    </form>
    </div>
  )
}