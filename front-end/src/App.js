import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import './App.css';



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


  return (
    <div class="app">

      <div class='signInDiv' id='signInDiv'></div>
      <h1 class='large-title' id='signInText'>Arweave JWT Authenticator</h1>

      <img class='favicon' src='favicon.png'></img>

      { Object.keys(user).length != 0 &&
      <button class='signOutButton' onClick={ (e) => handleSignOut(e)}>Sign Out</button>
      }

      { user && 
      <div class='profile'>
        <img class='user-picture' src={user.picture}></img>
        <h3 class='user-name'>{user.name}</h3>
        <p class='raw-jwt'></p>
      </div>
      }

      


    </div>
  );
}

export default App;
