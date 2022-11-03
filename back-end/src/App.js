import './App.css';
import Arweave from 'arweave';

function App() {

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
    <div className="App">

      hello

    </div>
  );
}

export default App;
