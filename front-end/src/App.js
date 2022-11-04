import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import './App.css';
import Arweave from 'arweave';
import { dataTransaction } from './interactWithAR.js';
import Records from './database.json'


function App() {

  const [ user, setUser ] = useState({});
  const [ JWT, setJWT ] = useState({});

  function handleCallbackResponse(response) {
    var rawJWT = response.credential
    setJWT(rawJWT)

    var userObject = jwtDecode(response.credential)
    setUser(userObject);
    
    document.getElementById('signInDiv').hidden = true;
    // document.getElementById('signInText').hidden = true;
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

  

  url = 'https://lorimer0jwt.pythonanywhere.com/check_key/?email=lorimer@wallety.org&&key=1234'


  // check if client has already a key
  // const clientEmail = user.email
  // if (clientEmail in Records) {
  //   const key = Records[clientEmail]
  // } else {
  //   const key = Records['lorimer@wallety.org']
  // }



// generate wallet
  // arweave.wallets.generate().then((key) => {
  //   console.log(key)
  // });



  // temp key
  const clientEmail = 'lorimer@wallety.org'
  // const clientEmail = 'lorimerjenkins1@gmail.com'

  const key = Records[clientEmail]

  // get wallet address private key
  const [ address, setAddress ] = useState({});
  arweave.wallets.jwkToAddress(key).then((address) => {
  setAddress(address)
  document.getElementById('address').innerHTML = address
});

  // get address balance
  arweave.wallets.getBalance(address).then((balance) => {
  let ar = arweave.ar.winstonToAr(balance);
  document.getElementById('balance').innerHTML = ar
});




  return (
    <div className="app">

      <div className='signInDiv' id='signInDiv'></div>
      {/* <h1 className='large-title' id='signInText'>Arweave JWT Authenticator</h1> */}
      <img className='favicon' src='favicon.png'></img>


      { Object.keys(user).length != 0 &&
      <button className='signOutButton' onClick={ (e) => handleSignOut(e)}>Sign Out</button>
      }


      <div className='profile' id='profile'>
        <img className='user-picture' src={user.picture}></img>
        <h3 className='user-name'>{user.name}</h3>
        <p className='user-email'>{user.email}</p>

        <p className='address'>
          <span className='bold'>Wallet Address: </span>
          <span id='address'></span>
        </p>
        <p className='balance'>
          <span className='bold'>Current Balance: </span>
          <span id='balance'></span> AR
        </p>

        <div className='saveTextDiv'>
          <input className='input' placeholder='Text to Permaweb' id='input' type="text/number/something-other-than-password" name="x-field-w" autoComplete="new-field-w"></input>
          <button className='submit-TXN' onClick={() => dataTransaction(key)}>Submit Transaction</button>
        </div>

      </div>


      


    </div>
  );
}

export default App;

