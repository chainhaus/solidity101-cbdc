console.log('Solidity 101, bro');

const ganache = require('ganache-cli');
const Web3 = require('web3');

const solc = require('solc'); // npm install -g solc

const path = require('path');
const fs = require('fs');
const contractLocation = path.resolve(__dirname,'contracts','SimpleCBDCurrency.sol');
const contract = fs.readFileSync(contractLocation,'utf8');
console.log(contract);


const config = require('config');



var run = async() => {
    web3 = new Web3(await ganache.provider());
    console.log('Obtaining accounts');
    //await web3.eth.getAccounts().then(console.log);
    //console.log(accounts);
    await web3.eth.getAccounts((err, res) => {accounts = res})
    // console.log(web3.eth.accounts[0][0]);
    // accounts = await web3.eth.getAccounts();
    console.log(accounts);
    console.log(accounts[0]);
    result = await solc.compile(contract,1)
    console.log(result)

    compiled = solc.compile(contract,1).contracts[':SimpleCBDCurrency'];

    console.log(compiled.interface);
    console.log(compiled.bytecode);

    cbdcContract = await new web3.eth.Contract(JSON.parse(compiled.interface))
    .deploy({data: '0x' + compiled.bytecode})
    .send({gas:'1000000',from:accounts[0]});

    console.log('Simple CBDC description',cbdcContract)

    console.log('Contract hash address',cbdcContract.options.address);
    balance = await cbdcContract.methods.totalSupply().call();
    console.log('Balance: ', balance );

    mintTransaction = await cbdcContract.methods.mint(20).send({from:accounts[0]});
    balance = await cbdcContract.methods.totalSupply().call()
    console.log('Balance: ', balance );


    transactionHash = mintTransaction.transactionHash;
    console.log('Transaction hash: ', transactionHash);

    mnemonic = config.get('mnemonic');
    //console.log("My menomic: ", mnemonic);


    infuraAccessKey = config.get('infuraAccessKey');
    console.log("My key: ", infuraAccessKey);

    const HDWalletProvider = require('truffle-hdwallet-provider');
    infuraURL = "https://rinkeby.infura.io/v3/" + infuraAccessKey

    provider = new HDWalletProvider(mnemonic,infuraURL);
    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();
    console.log('Accounts',accounts)    

    //Step 22 - Can demo small gas and contract creation failure
    cbdcContract = await new web3.eth.Contract(JSON.parse(compiled.interface))
    .deploy({data: '0x' + compiled.bytecode})
    .send({gas:'1000000',from:'0x0b60b4eD15dB494c84D815742a2E8497172f0bB7'}); 
    console.log('Rinkeby contract hash address',cbdcContract.options.address);

    cbdcContractHash  = cbdcContract.options.address
    cbdcContract = await new web3.eth.Contract(JSON.parse(compiled.interface),cbdcContractHash);
    //marriageCertificate = await cbdcContract.methods.obtainMarriageLicense('jack','jill').send({from:accounts[0]});



}

run();
