# lottery game contract
let we guess a number between 1 and 6

## environment
- node v14.0
- ganache
- `npm install -g truffle`
- `metamask` -- chrome extension

## run
add some contract code
- `npm install` will install dependencies from openzeppelin
- `truffle compile` will compile the contract
- `truffle migrate` will deploy the contract to the current network
- `truffle test` will test the contract test file

change web code
- `cd web && npm insatll && npm run dev`

## config
change `contractAddress(your contract address)` and `adminAddress(your wallet address)` in `web/lib/web3.js`