import Arweave from 'arweave';
const arweave = Arweave.init({});


export async function dataTransaction(key) {

    let data = document.getElementById('input').value

    if (data != '') {

        let transaction = await arweave.createTransaction({
            data: data
            }, key);
        transaction.addTag('Content-Type', 'text/plain');
        console.log(transaction);
    
        await arweave.transactions.sign(transaction, key);
    
        let uploader = await arweave.transactions.getUploader(transaction);
    
        while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        document.getElementById('input').value = ''

    }
    } else {alert('Please enter some text')}

}


// var key = require('./test_key.json');
// dataTransaction(key)






function decodeTransaction(id) {
    arweave.transactions.getData(id, {decode: true, string: true}).then(data => {
        console.log(data);
      });
}

// decodeTransaction('4dlXMoxd-HWUHn9NM-TMY3XusJmUZigDweHLQ9INMc8')


function getLastTXN(address) {
    arweave.wallets.getLastTransactionID(address).then((transactionId) => {
        console.log(transactionId);
    });
}

// getLastTXN('JJegjyFmwiZuII7bdDFnxpT5Hackam4t2cm3bC6gAq4')


function checkTXNstatus(id) {
    arweave.transactions.getStatus(id).then(res => {
        console.log(res);
    })
}

// checkTXNstatus('4dlXMoxd-HWUHn9NM-TMY3XusJmUZigDweHLQ9INMc8')