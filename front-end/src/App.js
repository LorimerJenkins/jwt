import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import './App.css';
import Arweave from 'arweave';



function App() {

  const [ user, setUser ] = useState({});

  function handleCallbackResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential)
    var userObject = jwtDecode(response.credential)
    console.log(userObject);
    setUser(userObject);
    document.getElementById('signInDiv').hidden = true;
    document.getElementById('signInText').hidden = true;
  }

  function handleSignOut(event) {
    setUser({})
    document.getElementById('signInDiv').hidden = false;
    document.getElementById('signInText').hidden = false;
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


  // generate arweave wallet
  arweave.wallets.generate().then((key) => {
  console.log(key);

    // get wallet address private key
    arweave.wallets.jwkToAddress(key).then((address) => {
    console.log(address);

      // get address balance
      arweave.wallets.getBalance(address).then((balance) => {
        let winston = balance;
        let ar = arweave.ar.winstonToAr(balance);
        console.log(winston);
        console.log(ar);

      });
    });
  });












  return (
    <div className="app">

      <div className='signInDiv' id='signInDiv'></div>
      <h1 className='large-title' id='signInText'>Arweave JWT Authenticator</h1>

      <img className='favicon' src='favicon.png'></img>

      { Object.keys(user).length != 0 &&
      <button className='signOutButton' onClick={ (e) => handleSignOut(e)}>Sign Out</button>
      }

      { user && 
      <div className='profile'>
        <img className='user-picture' src={user.picture}></img>
        <h3 className='user-name'>{user.name}</h3>
        <p className='raw-jwt'></p>
      </div>
      }

      


    </div>
  );
}

export default App;
