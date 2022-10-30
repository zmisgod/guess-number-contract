var LotteryGame = artifacts.require("LotteryGame.sol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(LotteryGame);
};