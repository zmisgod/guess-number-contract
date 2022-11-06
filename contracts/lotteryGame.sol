// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./gnCoin.sol";

contract lotteryGame is Ownable, GN {
    uint8 public lotteryHitNumber; //命中的参数 1-6
    string public lotteryTitle; //当前幸运数字
    uint16 public lotteryReward; //奖金
    uint8 public nowStatus; //当前状态 0未开始 1进行中 2待开奖 2已结束
    uint8 public maxUserJoinedNumber = 1; //最多N个人参与
    uint8 public maxUserRewardNumber = 1; //最多N个人获奖
    uint256 public guestEndTime = 0; //最后猜奖时间

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
    //是否发奖
    mapping(address => bool) isSendUserMoneyMap;

    function userGuestOne(uint8 userGuestNum) public payable {
        require((nowStatus == 1), "lottery not open yet");
        require(userGuest[msg.sender] == 0, "user has joined the game");
        require(
            userGuestList.length < maxUserJoinedNumber,
            "out of joined number"
        );
        commonValidate(userGuestNum);
        userGuest[msg.sender] = userGuestNum;
        userGuestList.push(
            userGuestItem({
                userAddress: msg.sender,
                guestNum: userGuestNum,
                guestTime: block.timestamp
            })
        );
    }

    function commonValidate(uint8 num) public pure {
        require((num >= 1 && num <= 6), "num is out of range");
    }

    function openReward() public onlyOwner {
        for (uint256 i; i < userGuestList.length; i++) {
            if (
                userGuestList[i].guestNum == lotteryHitNumber &&
                userHitRewards.length < maxUserRewardNumber
            ) {
                userHitRewards.push(userGuestList[i].userAddress);
            }
        }
        sendUserMoney();
    }

    function sendUserMoney() public payable onlyOwner {
        if (lotteryReward == 0) {
            return;
        }
        for (uint256 i; i < userHitRewards.length; i++) {
            if (isSendUserMoneyMap[userHitRewards[i]]) {
                continue;
            }
            transfer(userHitRewards[i], lotteryReward);
            isSendUserMoneyMap[userHitRewards[i]] = true;
        }
    }

    function getUserHitRewardsList() public view returns (address[] memory) {
        return userHitRewards;
    }

    //reset this game all of data to empty
    function resetLotteryStatus() external onlyOwner {
        lotteryHitNumber = 0;
        lotteryTitle = "";
        lotteryReward = 0;
        nowStatus = 0;
        maxUserJoinedNumber = 1;
        maxUserRewardNumber = 1;
        guestEndTime = 0;
        for (uint256 i = 0; i < userGuestList.length; i++) {
            delete (userGuest[userGuestList[i].userAddress]);
        }
        for (uint256 i = 0; i < userGuestList.length; i++) {
            userGuestList.pop();
        }
        for (uint256 i = 0; i < userHitRewards.length; i++) {
            delete (isSendUserMoneyMap[userHitRewards[i]]);
        }
        for (uint256 i = 0; i < userHitRewards.length; i++) {
            userHitRewards.pop();
        }
    }

    function startUserJoinGame() external onlyOwner {
        nowStatus = 1;
    }

    function stopUserJoinGame() external onlyOwner {
        nowStatus = 2;
    }

    function stopGame() external onlyOwner {
        nowStatus = 3;
    }

    function setLottetryInfo(
        string memory title,
        uint8 userJoinedNum,
        uint8 userRewardNum,
        uint16 reward
    ) external onlyOwner {
        maxUserJoinedNumber = userJoinedNum;
        maxUserRewardNumber = userRewardNum;
        lotteryTitle = title;
        lotteryReward = reward;
    }

    function setLotteryHitNumber(uint8 num) external onlyOwner {
        require(nowStatus == 2, "status is not wait open reward");
        lotteryHitNumber = num;
        openReward();
    }

    function getLotteryTitle() public view returns (string memory) {
        return lotteryTitle;
    }

    function getNowStatus() public view returns (uint8) {
        return nowStatus;
    }

    function getLottertyHitNumber() public view returns (uint8) {
        return lotteryHitNumber;
    }

    function getLotteryReward() public view returns (uint16) {
        return lotteryReward;
    }

    function getUserGuestItem() public view returns (userGuestItem[] memory) {
        return userGuestList;
    }

    function getMaxUserJoinedNumber() public view returns (uint8) {
        return maxUserJoinedNumber;
    }

    function getMaxUserRewardNumber() public view returns (uint8) {
        return maxUserRewardNumber;
    }

    function getUserGuessNumber() public view returns (uint8) {
        return userGuest[msg.sender];
    }

    function checkUserIsReward() public view returns (bool) {
        for (uint8 i = 0; i < userHitRewards.length; i++) {
            if (userHitRewards[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }
}
