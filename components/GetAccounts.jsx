import { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { usePlaidLink } from 'react-plaid-link';
import { useTable } from 'react-table';
import './BasicTable.css';
import { Link, useLocation } from 'react-router-dom';
import { Context } from "../src/App"
import 'jquery';
import 'bootstrap';
import logo2 from '../src/logo2.jpg'

export default function GetAccounts() {
  const [account, setAccount] = useState();

  const [accessToken, setaccessToken] = useContext(Context)
  const [ccid, setCcid] = useState();

  useEffect(() => {
    async function fetchData() {
      const accounts = await axios.post('/accounts/balance/get', { access_token: accessToken });
      console.log('auth data', accounts.data);
      setAccount(accounts.data.accounts);
      for (let i = 0; i < accounts.data.accounts.length; i++) {
        if (accounts.data.accounts[i].name === "Plaid Credit Card")
          setCcid(accounts.data.accounts[i].account_id)
      }
    }
    fetchData();
  }, []);

  const COLUMNS = [
    { Header: 'Account Name', accessor: 'name' },
    { Header: 'Current Balance', accessor: 'balances.current' },
    { Header: 'Currency', accessor: 'balances.iso_currency_code' },
    {
      Header: 'Transactions',
      accessor: 'account_id',
      Cell: ({ value }) => <Link to="/transactions" state={{ accessor: value }}><button type='button' className='accountpage-txnbutton'>View Transactions</button></Link>,
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => account || [], [account]);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  function handleLogOut() {
    window.localStorage.clear();
    window.location.href = "./";
  }


  if (!account) {
    return <div className='loading-container'>
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
    </div>
      ;
  }
  return (
    <div className='accounts-container'>
      <button type='button' className='accpage-logout' onClick={handleLogOut}> Log Out </button>
      <div className='acc-headers'>
        <img src={logo2} alt="App Logo" className="logo2" />
        <h2 className='acc-heading'>Hi There! These Are Your Accounts</h2>
        <Link to='/transfer' state={{ account, accessToken }}>
          <button type='button' className='accpage-paymentbutton'>Make a Payment</button>
        </Link>
        <Link to='/spend_analysis' state={{ ccid }}>
          <button type='button' className='accpage-SAbutton'>Spend Analysis - Credit Card</button>
        </Link>
        <Link to='/calendar' >
          <button type='button' className='accpage-FCbutton'>Go to my Financial Calendar</button>
        </Link>
      </div>
      {/* {showTransactions && <GetTransactions token={publicToken2} />} */}
      <div>
        <table {...getTableProps()}>
          <thead>
            {headerGroups?.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
            <tr></tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows?.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="footer-welcomepage">
        <p className="trademark-welcomepage">© 2023 Pranav Ram Hariharan. All rights reserved. This is a work for my MSc Project.</p>
      </div>
    </div>
  );
}
