const lotteryGame = artifacts.require("lotteryGame");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("lotteryGame", function (/* accounts */) {
  it("check common validate is error(game is not start)", async function () {
    const contract = await lotteryGame.deployed();
    try{
      await contract.commonValidate(23);
      return assert.isTrue(true);
    }catch(e) {
      return assert.isTrue(false);
    }
  })

  it("check common validate is ok(start user join game)", async function () {
    const contract = await lotteryGame.deployed();
    await contract.startUserJoinGame();
    try {
      await contract.commonValidate(2);
      return assert.isTrue(true);
    } catch (e) {
      return assert.isTrue(false);
    }
  })
});
