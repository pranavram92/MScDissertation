import React, { useState, useEffect } from 'react';
import './BasicTable.css'
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { usePlaidLink } from "react-plaid-link";
import $ from 'jquery';
import 'bootstrap';
import bootbox from 'bootbox';
import logo2 from "../src/logo2.jpg"

window.jQuery = $;
window.$ = $;

export default function Transfer() {

  const [transferIntentId, setTransferIntentId] = useState();
  const [transferLinkToken, setTransferLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();
  const [latestTransfer, setLatestTransfer] = useState();
  const [result, setResult] = useState();
  const [sCode, setSCode] = useState({ sortCode: '' });

  const [payee, setPayee] = useState(
    {
      mode: "payment",
      amount: "",
      description: "",
      // account_id:"",
      ach_class: "ppd",
      user: {
        legal_name: "Test User"
      }
    });

  function myAlert() {
    bootbox.confirm({
      title: "Confirmation Required!",
      message: `Please confirm if the details are correct. 
      <b>Routing Number:</b> ${sCode.sortCode}.
      <b>Amount:</b> ${payee.amount} USD.
      <b>Description:</b> ${payee.description}`,
      buttons: {
        confirm: {
          label: 'Confirm',
          className: 'btn-success'
        },
        cancel: {
          label: 'Cancel',
          className: 'btn-danger'
        }
      },
      callback: function (Result) {
        setResult(Result)
      }
    });
  }

  async function fetchData() {
    try {
      const response = await axios.post('/transfer/intent/create', payee);
      console.log(response.data)
      setTransferIntentId(response.data.transfer_intent.id)
    } catch (error) {
      console.error(error);
    }
    myAlert();
  };

  useEffect(() => {
    let newLink = {
      user: {
        client_user_id: 'user-id',
      },
      client_name: 'Plaid Test App',
      country_codes: ['US'],
      language: 'en',
      products: ['transfer'],
      transfer: {
        intent_id: transferIntentId,
      },
      link_customization_name: 'transfer2',
    };

    async function fetchLinkToken() {
      const response = await axios.post("/link/token/create", newLink);
      setTransferLinkToken(response.data.link_token);
    }
    fetchLinkToken();

  }, [transferIntentId]);

  const { open, ready } = usePlaidLink({
    token: transferLinkToken,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
      setResult(prevResult => !prevResult)
      // console.log("success");
      setSCode({ sortCode: '' });
      setPayee({
        mode: "payment",
        amount: "",
        description: "",
        ach_class: "ppd",
        user: {
          legal_name: "Test User"
        }
      });
    }
  });

  useEffect(() => {
    result && open();
  }, [result])

  const handlePayeeInputChange = (e) => {
    setPayee({ ...payee, [e.target.name]: e.target.value });
  };

  async function getTransfer() {
    try {
      const transferResponse = await axios.post("/transfer/intent/get", { transfer_id: transferIntentId });
      setLatestTransfer(transferResponse.data);
      latestTransfer ? bootbox.alert({
        title: "Your latest transfer details:",
        message: `
        <b>Name</b>: ${latestTransfer.transfer_intent.user.legal_name},
        <b>Date</b>: ${latestTransfer.transfer_intent.created.substring(0, 10)},
        <b>Amount</b>: $${latestTransfer.transfer_intent.amount},
        <b>Currency</b>: ${latestTransfer.transfer_intent.iso_currency_code},
        <b>Status</b>: ${latestTransfer.transfer_intent.authorization_decision},
        <b>Description</b>: ${latestTransfer.transfer_intent.description},
        <b>Transfer-ID</b>:${latestTransfer.transfer_intent.transfer_id}`,
        size: 'large'
      }) : (!publicToken && bootbox.alert("No Transfers found. Please Make a New Transfer."));
    }
    catch (error) {
      console.error(error);
    }
  };

  function handleLogOut() {
    window.localStorage.clear();
    window.location.href = "./";
  }

  // publicToken && fetchAccessToken();

  return (
    <div className='payment-main-container'>
      <div className="buttons-flex">
        <Link to='/accounts'><button type='button' className='payment-transfer-back'>Back to your accounts</button></Link>
        <Link to="/"><button type='button' className='payment-transfter-logout' onClick={handleLogOut}> Log Out </button></Link>
      </div>


      <form className="form-paymentpage">
        <div className='paymentpage-headercontainers'>
          <img src={logo2} alt="App Logo" className="logo2-paymentpage" />
          <h3 className='paymentpage-head'>Make Your Payment</h3>
        </div>
        <label htmlFor='SortCode'>Routing Number</label>
        <input
          type="text"
          id="SortCode"
          name="sortCode"
          onChange={(e) => setSCode({ [e.target.name]: e.target.value })}
          placeholder="Enter the 9 digit Routing Number "
          value={sCode.sortCode}
        />

        <label htmlFor='Amount'>Amount</label>
        <input
          type="text"
          id="Amount"
          name="amount"
          placeholder="Enter the amount with two decimal points"
          onChange={handlePayeeInputChange}
          value={payee.amount}
        />

        <label htmlFor='Desription'>Description</label>
        <input
          type="text"
          id="Description"
          name="description"
          maxLength="8"
          placeholder="Enter the description here (Maximum 8 characters)"
          onChange={handlePayeeInputChange}
          value={payee.description}
        />
      </form>

      <button className="transfer-button-paymentpage" onClick={fetchData}>Initiate my transfer</button>
      <button className="transfer-button2-paymentpage" onClick={getTransfer} >View Latest Transfer</button>
      <div className="footer-welcomepage">
        <p className="trademark-welcomepage">© 2023 Pranav Ram Hariharan. All rights reserved. This is a work for my MSc Project.</p>
      </div>
    </div>
  );
};
