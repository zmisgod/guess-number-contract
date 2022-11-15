import { createContext, useState, useEffect } from "react"
import { contractAddress, contractABI, adminAddress } from './../lib/web3';
export const ContractContext = createContext();
import { ethers } from 'ethers';

export const ContractContextProvider = function ({ children }) {
    const [accounts, setAccounts] = useState([]);
    const [title, setTitle] = useState("");
    const [nowStatus, setNowStatus] = useState(0)
    const [reward, setReward] = useState(0);
    const [ownToken, setOwnToken] = useState(0);
    const [hitNumber, setHitNumber] = useState(0);
    const [maxUserJoinedNumber, setMaxUserJoinedNumber] = useState(0);
    const [maxUserRewardNumber, setMaxUserRewardNumber] = useState(0);
    const [joinList, setJoinList] = useState([]);
    const [isHitReward, setIsHitReward] = useState(false);
    const [canUserGuess, setCanUserGuess] = useState(true);
    const [userGuessNumber, setUserGuessNumber] = useState(0);

    const onConnect = async () => {
        window.ethereum.request({ method: "eth_requestAccounts" }).then(setAccounts);
    }

    const fetchUserGuessedNumber = async () => {
        let contract = await getContract();
        contract.getUserGuessNumber.call().then(res => {
            if (res > 0) {
                setCanUserGuess(false);
                setUserGuessNumber(res);
            }
        });
    }

    const onChangeUserGuessNumber = (e) => {
        setUserGuessNumber(e.target.value);
    }

    const onGuessANumber = async () => {
        const contract = await getContract();
        try {
            let data = await contract.userGuestOne(parseInt(userGuessNumber))
            alert("参与成功")
        } catch (e) {
            alert(e.data.message)
        }
    }

    const getContract = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        return contract;
    }

    const fetchUserJoinedList = async () => {
        let contract = await getContract();
        contract.getUserGuestItem.call().then(setJoinList);
    }

    const fetchLotteryStatus = async () => {
        let contract = await getContract();
        contract.getNowStatus.call().then(setNowStatus);
    }

    const fetchLotteryTitle = async () => {
        let contract = await getContract();
        contract.getLotteryTitle.call().then(setTitle);
    }

    const fetchLotteryReward = async () => {
        let contract = await getContract();
        contract.getLotteryReward.call().then((res) => {
            setReward(parseInt(ethers.BigNumber.from(res), 10))
        });
    }

    const fetchMaxUserJoinedNumber = async () => {
        let contract = await getContract();
        contract.getMaxUserJoinedNumber.call().then(setMaxUserJoinedNumber);
    }

    const fetchMaxUserRewardNumber = async () => {
        let contract = await getContract();
        contract.getMaxUserRewardNumber.call().then(setMaxUserRewardNumber);
    }

    const fetchHitNumber = async () => {
        let contract = await getContract();
        contract.getLottertyHitNumber.call().then(setHitNumber);
    }

    const fetchUserOwnToken = async () => {
        if (accounts.length > 0) {
            let contract = await getContract()
            contract.balanceOf(accounts[0]).then(res => {
                console.log(res)
                setOwnToken(ethers.utils.formatUnits(res, 18))
            });
        } else {
            setOwnToken(0)
        }
    }

    const fetchIsUserHitReward = async () => {
        let contract = await getContract();
        contract.checkUserIsReward.call().then(setIsHitReward);
    }

    const onAdminConnect = async () => {
        let res = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (res.length != 0) {
            if (res[0].toLowerCase() !== adminAddress.toLowerCase()) {
                alert("请使用管理员钱包登录")
            } else {
                setAccounts(res)
            }
        }
    }

    useEffect(() => {
        if (accounts.length > 0) {
            fetchUserOwnToken()
            fetchIsUserHitReward();
            fetchUserGuessedNumber();
            fetchLotteryStatus();
            fetchLotteryTitle();
            fetchLotteryReward();
            fetchMaxUserJoinedNumber();
            fetchMaxUserRewardNumber();
            fetchHitNumber();
            fetchUserJoinedList();
        }
    }, [accounts])

    const onChangeTitle = (e) => {
        setTitle(e.target.value)
    }

    const onChangeReward = (e) => {
        setReward(e.target.value)
    }

    const onChangeHitNumber = (e) => {
        setHitNumber(e.target.value)
    }

    const onChangeUserJoinedMaxNumber = (e) => {
        setMaxUserJoinedNumber(e.target.value)
    }

    const onChangeUserRewardMaxNumber = (e) => {
        setMaxUserRewardNumber(e.target.value)
    }

    const doTransferToken = async (address, wei) => {
        let contract = await getContract();
        return contract.transfer(address, wei)
    }

    const saveData = async () => {
        const contract = await getContract();
        try {
            let data = await contract.setLottetryInfo(title, parseInt(maxUserJoinedNumber, 10), parseInt(maxUserRewardNumber, 10), parseInt(reward, 10))
            console.log(data)
        } catch (e) {
            alert(e)
        }
    }

    const prepareOpenReward = async () => {
        const contract = await getContract();
        try {
            let data = await contract.stopUserJoinGame()
            console.log(data)
        } catch (e) {
            alert(e)
        }
    }

    const startGame = async () => {
        const contract = await getContract();
        try {
            let data = await contract.startUserJoinGame()
            console.log(data)
        } catch (e) {
            alert(e)
        }
    }

    const saveHitNumber = async () => {
        const contract = await getContract();
        try {
            let data = await contract.setLotteryHitNumber(parseInt(hitNumber, 10))
            console.log(data)
        } catch (e) {
            alert(e)
        }
    }

    const announceReward = async () => {
        const contract = await getContract();
        try {
            let data = await contract.stopGame()
            console.log(data)
        } catch (e) {
            alert(e)
        }
    }

    const restartGame = async () => {
        const contract = await getContract();
        try {
            let data = await contract.resetLotteryStatus()
            console.log(data)
        } catch (e) {
            alert(e)
        }
    }

    return (
        <ContractContext.Provider value={{
            accounts, title, nowStatus, reward, ownToken, hitNumber, maxUserJoinedNumber, maxUserRewardNumber, joinList, isHitReward, canUserGuess, userGuessNumber,
            onAdminConnect, saveHitNumber, announceReward, startGame, prepareOpenReward, onConnect,
            saveData, onChangeUserRewardMaxNumber, onChangeUserJoinedMaxNumber, onChangeHitNumber,
            onChangeReward, onChangeTitle, onChangeUserGuessNumber, onGuessANumber, doTransferToken, restartGame,
        }}>
            {children}
        </ContractContext.Provider>
    )
}