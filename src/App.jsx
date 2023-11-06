import { useEffect, useState, useRef, createContext } from 'react'
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import GetAccounts from '../components/GetAccounts.jsx'
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import '../components/BasicTable.css'
import Calendar from "../components/Calendar"
import Transfer from "../components/Transfer"
import SpendAnalysis from "../components/SpendAnalysis"
import Register from "./Register"
import GetTransactions from "../components/GetTransactions"
import ResetPassword from "./ResetPassword"
import logo2 from "./logo2.jpg"

axios.defaults.baseURL = "http://localhost:8000"
export const Context = createContext();

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const loginToken = window.localStorage.getItem("token");
  const [response, setResponse] = useState()
  const [accessToken, setAccessToken] = useState();

  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();


  if (isLoggedIn) {
    async function tokenVerification() {
      const tokenResponse = await axios.post("/verifySessionToken", {loginToken: loginToken})
      if (tokenResponse.data.message === 'Token verification successful') {
        setResponse(true)
        // console.log('login token verification succesfull')
      }
      else {
        window.localStorage.clear();
        window.location.href = "./";
        console.log('login token verification failed')
      }
    }
    (loginToken && !response) && tokenVerification();

    const linkTokenData = {
      user: {
        client_user_id: 'user-id',
      },
      client_name: 'Plaid Test App',
      products: ['transactions'],
      language: 'en',
      redirect_uri: 'http://localhost:5173/',
      country_codes: ['US'],
    };
    async function fetch() {
      const response = await axios.post("/link/token/create", linkTokenData);
      setLinkToken(response.data.link_token);
    }
    !linkToken && fetch();
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      // setPublicToken(public_token);
      console.log("success", public_token, metadata);
      setPublicToken(public_token)
    },
  });

  useEffect(() => {
    async function callAccessToken() {
      let accessToken = await axios.post('/item/public_token/exchange', { public_token: publicToken });
      setAccessToken(accessToken.data.accessToken)
    }
    callAccessToken()
  }, [publicToken])

  function handleLogOut() {
    window.localStorage.clear();
    window.location.href = "./";
  }

  return (
    <div>
      <Context.Provider value={[accessToken, setAccessToken]}>
        <Routes>
          <Route path="/" element={(isLoggedIn == 'true' && response) ?
            (accessToken ? <GetAccounts /> : (publicToken ? <div className='loading-container'>
            <div class="spinner-grow text-warning" role="status">
              <span class="sr-only"></span>
            </div>
            <div class="spinner-grow text-info" role="status">
              <span class="sr-only"></span>
            </div>
            <div class="spinner-grow text-danger" role="status">
              <span class="sr-only"></span>
            </div>
            <div class="spinner-grow text-dark" role="status">
              <span class="sr-only"></span>
            </div>
          </div> : <>
              <div className='welcomepage-container'>
                <img src={logo2} alt="App Logo" className="logo2" />
                <button type='button' className='welcomepage-logoutbutton' onClick={handleLogOut}> Log Out </button>
                <div className="container-welcomedescription">
                  <h1 className="title-welcomepage">Welcome to Fin-Stir.</h1>
                  <p className="description-welcomepage">Experience a powerful financial management tool that helps you track your expenses, manage your accounts, and gain insights into your spending habits.</p>
                  <button className='Connect-Button' onClick={() => open()} disabled={!ready}>Connect Your Bank Account</button>
                </div>
                <div className="footer-welcomepage">
                  <p className="trademark-welcomepage">© 2023 Pranav Ram Hariharan. All rights reserved. This is a work for my MSc Project.</p>
                </div></div> </>)) :
            <Register />} />
          <Route path='/pwdreset' element={<ResetPassword />} />
          <Route path="/accounts" element={<GetAccounts />} />
          <Route path='/transactions' element={<GetTransactions />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='/transfer' element={<Transfer />} />
          <Route path='/spend_analysis' element={<SpendAnalysis />} />
          <Route path='/Register' element={<Register />} />
        </Routes>
      </Context.Provider>
    </ div>
  );
}

export default App