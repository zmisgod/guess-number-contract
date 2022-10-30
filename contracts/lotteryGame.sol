// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract lotteryGame is Ownable {
    uint8 public lotteryHitNumber; //命中的参数 1-6
    string public lotteryTitle; //当前幸运数字
    uint16 public lotteryReward; //奖金
    uint8 public nowStatus; //当前状态 0未开始 1进行中 2待开奖 2已结束
    uint8 public maxUserJoined;//最多N个人参与
    uint8 public maxUserReward;//最多N个人获奖

    //用户猜的数字
    mapping(address => uint8) public userGuest;

    struct userGuestItem {
        address userAddress;
        uint8 guestNum;
        uint256 guestTime;
    }
    userGuestItem[] public userGuestList;

    //获奖用户
    address[] public userHitRewards;

    function userGuestOne(uint8 userGuestNum) public payable {
        require((nowStatus == 1), "lottery not open yet");
        commonValidate(userGuestNum);
        require(userGuest[msg.sender] > 0);
        userGuest[msg.sender] = userGuestNum;
        userGuestList.push(
            userGuestItem({
                userAddress: msg.sender,
                guestNum: userGuestNum,
                guestTime: 0
            })
        );
    }

    function commonValidate(uint8 num) pure public {
        require((num >= 1 && num <= 6), "num is out of range");
    }

    function openReward() public onlyOwner {
        for (uint256 i; i < userGuestList.length; i++) {
            if (userGuestList[i].guestNum == lotteryHitNumber && ) {
                userHitRewards.push(userGuestList[i].userAddress);
            }
        }
    }

    function getUserHitRewardsList() public view returns (address[] memory) {
        return userHitRewards;
    }

    function resetLotteryStatus() public onlyOwner {
        nowStatus = 0;
    }

    function startUserJoinGame() public onlyOwner {
      nowStatus = 1;
    }

    function stopUserJoinGame() public onlyOwner {
      nowStatus = 2;
    }

    function stopGame() public onlyOwner {
      nowStatus = 3;
    }

    function setLottetryInfo(
        string memory title,
        uint8 hitNumber,
        uint16 reward
    ) public onlyOwner {
        commonValidate(hitNumber);
        lotteryHitNumber = hitNumber;
        lotteryTitle = title;
        lotteryReward = reward;
    }

    function getNowLotteryTitle() public view returns (string memory) {
        return lotteryTitle;
    }

    function getNowStatus() public view returns (uint8){
        return nowStatus;
    }

    function getNowLottertyHitNumber() public view returns (uint8) {
        return lotteryHitNumber;
    }

    function getNowLotteryReward() public view returns (uint16) {
        return lotteryReward;
    }
}
