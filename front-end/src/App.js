import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import './App.css';
import Arweave from 'arweave';

import { identify } from './JWT_identifier.js';

import { dataTransaction } from './interactWithAR.js';


function App() {

  const [ user, setUser ] = useState({});
  const [ JWT, setJWT ] = useState({});

  function handleCallbackResponse(response) {
    var rawJWT = response.credential
    setJWT(rawJWT)

    var userObject = jwtDecode(response.credential)
    setUser(userObject);
    
    document.getElementById('signInDiv').hidden = true;
    document.getElementById('signInText').hidden = true;
    document.getElementById('profile').style.display = 'flex'
  }




  function handleSignOut(event) {
    // clears var
    setUser({})
    document.getElementById('signInDiv').hidden = false;
    document.getElementById('signInText').hidden = false;
    document.getElementById('profile').style.display = 'none'
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: '452069452454-acvtmk3imjmbpgnrcti5k5vhgqe04t9v.apps.googleusercontent.com',
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById('signInDiv'), 
      { theme: 'outline', size: 'large' }
    );


  }, [])



  

  // connect to arweave
  const arweave = Arweave.init({});

  const [ key, setKey ] = useState({});

    
  // // identify(JWT)

  // if JWT func check {

  //   // get key from a file

  // } else {

  // // generate arweave wallet and then apply the key to the wallet
  // arweave.wallets.generate().then((key) => {
  //   setKey(key)
  // });

  // }


  // // get wallet address private key
  // const [ address, setAddress ] = useState({});
  // arweave.wallets.jwkToAddress(key).then((address) => {
  // setAddress(address)});

  // // get address balance
  // const [ balance, setBalance ] = useState({});
  // arweave.wallets.getBalance(address).then((balance) => {
  // let ar = arweave.ar.winstonToAr(balance);
  // setBalance(ar)});











  return (
    <div className="app">

      <div className='signInDiv' id='signInDiv'></div>
      {/* <h1 className='large-title' id='signInText'>Arweave JWT Authenticator</h1> */}
      <img className='favicon' src='favicon.png'></img>


      { Object.keys(user).length != 0 &&
      <button className='signOutButton' onClick={ (e) => handleSignOut(e)}>Sign Out</button>
      }


      <div className='profile' id='profile'>
        {/* <img className='user-picture' src={user.picture}></img>
        <h3 className='user-name'>{user.name}</h3>
        <p className='user-name'>{user.email}</p> */}
        <img className='user-picture' src='https://jwt.lorimerjenkins.com/favicon.png'></img>
        <h3 className='user-name'>Lorimer Jenkins</h3>
        <p className='user-email'>lorimer@wallety.org</p>

        {/* <p className='address'>{JSON.stringify(address)}0000000000000000</p>
        <p className='balance'>Current Balance: {JSON.stringify(balance)}AR</p> */}
        <p className='address'>
          <span className='bold'>Wallet Address: </span>JJegjyFmwiZuII7bdDFnxpT5Hackam4t2cm3bC6gAq4
        </p>
        <p className='balance'>
          <span className='bold'>Current Balance: </span>10.434 AR
        </p>

        <div className='saveTextDiv'>
          <input className='input' type="text" placeholder='Text to Permaweb' id='input'></input>
          <button className='submit-TXN'>Submit Transaction</button>
        </div>

      </div>


      


    </div>
  );
}

export default App;