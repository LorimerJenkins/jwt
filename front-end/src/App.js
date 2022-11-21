import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import './App.css';
import Arweave from 'arweave';
import { dataTransaction } from './interactWithAR.js';


function App() {
  const [ user, setUser ] = useState({});
  const [ JWT, setJWT ] = useState({});
  function handleCallbackResponse(response) {
    var rawJWT = response.credential
    console.log(rawJWT)
    setJWT(rawJWT)
    var userObject = jwtDecode(response.credential)
    console.log(userObject)
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


  function walletData(key, TF) {

    if (TF == 'yesParse') {
      var key = JSON.parse(key)
    } else {}

    // get wallet address private key
    arweave.wallets.jwkToAddress(key).then((address) => {
    document.getElementById('address').innerHTML = address

    // get address balance
    arweave.wallets.getBalance(address).then((balance) => {
      let ar = arweave.ar.winstonToAr(balance);
      document.getElementById('balance').innerHTML = ar
    });
  });
}


  const [ clientKey, setKey ] = useState({});
  async function check_key(email) {
    const url = 'https://lorimer0jwt.pythonanywhere.com/check_key/?email=' + email
    const response = await fetch(url);
    const response_json = await response.json();
    const data = await response_json.response


    if (data == 'not found') {
      // generate wallet
      arweave.wallets.generate().then((key) => {

        async function add_key(email, key) {
          const key_send_format = JSON.stringify(key)
          const url = 'https://lorimer0jwt.pythonanywhere.com/add_key/?email=' + email + '&&key=' + key_send_format
          const response = await fetch(url);
          const response_json = await response.json();
          const data = await response_json.response
        }
        add_key(email, key)
        walletData(key, 'noParse')
        var parsedClientKey = JSON.parse(key)
        setKey(parsedClientKey)
      });

    } else {
      walletData(data, 'yesParse')
      var parsedClientKey = JSON.parse(data)
      setKey(parsedClientKey)
    }
  }


  if (user.email != undefined) {
     check_key(user.email)
  }
 



  return (
    <div className="app">

      <div className='signInDiv' id='signInDiv'></div>
      <h1 className='large-title' id='signInText'>Arweave JWT Authenticator</h1>
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
          <button className='submit-TXN' onClick={() => dataTransaction(clientKey)}>Submit Transaction</button>
        </div>

      </div>


      


    </div>
  );
}

export default App;

