import React from 'react'
import { useEffect, useState, useRef } from 'react';
import bootbox from 'bootbox';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import LogoFinal from "./LogoFinal.jpg"

const password_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;

export default function Register() {
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mPassword, setMPassword] = useState('')

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState('')
  const captchaRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    let form = {}
    const pwd = password_REGEX.test(password)
    if (title && name && email && password && mPassword) {
      pwd ? form = { title, name, email, password, mPassword } : bootbox.alert(" Sorry, Password not Accepted. Please change as Instructed.")
    } else {
      bootbox.alert("Error! Please Enter Missing Values")
    }
    if (pwd) {
      if (form.title && form.name && form.email && form.password && form.mPassword) {
        if (form.password === form.mPassword) {
          async function postUser() {
            let postResponse = await axios.post('/mongoDB/postData', form);
            console.log(postResponse.data);
            
            if (postResponse.data.message === 'User Already Exists') {
              bootbox.alert("User Already Registered, Please Try Logging In")
              setTitle('')
              setName('')
              setEmail('')
              setPassword('')
              setMPassword('')
            }
            else {
              bootbox.alert("Congratulations. You are now Registered.")
              setTitle('')
              setName('')
              setEmail('')
              setPassword('')
              setMPassword('')
            }
          }
          postUser();
        }
        else {
          bootbox.alert("Passwords do not match. Please try again.")
        }
      }
      else {
        bootbox.alert("Please fill the missing fields.")
      }
    }

  };


  async function loginHandleSubmit(e) {
    e.preventDefault();
    captchaRef.current.reset();
    if (loginEmail && loginPassword) {
      if (captchaValue) {
        const response = await axios.post('/mongoDB/getData', { email: loginEmail, password: loginPassword });
        console.log(response.data);
        if (response.data.status === 'ok. Login Accepted') {
          window.localStorage.setItem("token", response.data.data);
          window.localStorage.setItem("loggedIn", true);
          setCaptchaValue('')
          window.location.href = "./";
        } else {
          bootbox.alert(response.data.error);
          setCaptchaValue('')
        }
      }
      else {
        bootbox.alert("Please Tick The Captcha")
      }
    } else {
      bootbox.alert("Please Fill All Relevant Details To Login")
    }
  };

  return (
    <div className='auth-container'>

      <div className='form-login-logo-container'>
        <img src={LogoFinal} alt='Logo' className='logo-image' />
        <div className='login-form-container col-md-6'>

          <form onSubmit={loginHandleSubmit}>
            <div className='form-group-1'>
              <label className='form-group-label'>Email:</label>
              <input
                className='form-group-input'
                type='email'
                name='email'
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder='Enter Email Address'
              />
            </div>
            <div className='form-group'>
              <label className='form-group-label'>Password:</label>
              <input
                className='form-group-input'
                type='password'
                name='password'
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder='Enter Password'
              />
            </div>
            <div >
              <ReCAPTCHA
                sitekey="6LcTwmwnAAAAABtscIBm7vAsHbJ86_dj78DHefkz"
                className='reCaptcha'
                onChange={(value) => setCaptchaValue(value)}
                ref={captchaRef}
              />
            </div>
            <button className='form-button' type='submit'>
              Login
            </button>
            <a href="/pwdreset">Forgot Password?</a>
          </form>
        </div>
      </div>
      <div className='registration-form-container col-md-6'>
        <div>
          <h2 className='registration-form-Heading'>Register Now!!!</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label className='form-group-label'>Title</label>
          <select
            type="text"
            id="register-title"
            name="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className='form-select'
          >
            <option value="" disabled hidden defaultValue="Choose Month">Choose Title</option>
            <option value="Mr." >Mr</option>
            <option value="Mrs.">Mrs</option>
            <option value="Ms.">Ms</option>
          </select>

          <div className='form-group'>
            <label className='form-group-label'>Full Name:</label>
            <input className='form-group-input' type="text" name="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Full Name' />
          </div>
          <div className='form-group'>
            <label className='form-group-label'>Email:</label>
            <input className='form-group-input' type="email" name="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email Address' />
          </div>
          <div className='form-group'>
            <label className='form-group-label'>Password:</label>
            <input className='form-group-input' type="password" name="Password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' />
          </div>
          <p id="pwdnote" className="form - instructions" >
            Must include 8 to 24 characters, uppercase and lowercase letters, a number and a special character.<br />
            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span><span aria-label="asterik">*</span>
          </p>
          <div className='form-group'>
            <label className='form-group-label'>Confirm Password:</label>
            <input className='form-group-input' type="password" name="mPassword" value={mPassword} onChange={(e) => setMPassword(e.target.value)} placeholder='Re-Enter Password' />
          </div>
          <button className='form-button' type="submit">Submit</button>
        </form>
      </div>
      <div className="footer-welcomepage">
        <p className="trademark-welcomepage">© 2023 Pranav Ram Hariharan. All rights reserved. This is a work for my MSc Project.</p>
      </div>
    </div>
  );
}

