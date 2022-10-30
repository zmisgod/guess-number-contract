import Head from 'next/head'
import { useEffect, useState } from 'react'
import { contractAddress, contractABI, adminAddress } from './../lib/web3';
import { ethers } from 'ethers';

export default function Client() {

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  }

  const [accounts, setAccounts] = useState([]);
  const [title, setTitle] = useState("");
  const [nowStatus, setNowStatus] = useState(0)
  const [reward, setReward] = useState(0);
  const [hitNumber, setHitNumber] = useState(0);
  const [maxUserJoinedNumber, setMaxUserJoinedNumber] = useState(0);
  const [maxUserRewardNumber, setMaxUserRewardNumber] = useState(0);

  const onConnect = async () => {
    let res = await  window.ethereum.request({ method: "eth_requestAccounts" });
    if(res.length != 0) {
        if(res[0].toLowerCase() !== adminAddress.toLowerCase()) {
            alert("请使用管理员钱包登录")
        }else{
            setAccounts(res)
        }
    }
  }

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
    contract.getLotteryReward.call().then(setReward);
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

  useEffect(() => {
    fetchLotteryStatus();
    fetchLotteryTitle();
    fetchLotteryReward();
    fetchMaxUserJoinedNumber();
    fetchMaxUserRewardNumber();
    fetchHitNumber();
  }, [])

  const saveData = async () => {
    const contract = await getContract();
    try{
        let data = await contract.setLottetryInfo(title, parseInt(maxUserJoinedNumber, 10), parseInt(maxUserRewardNumber, 10), parseInt(reward, 10))
        console.log(data)
    }catch(e) {
        alert(e)
    }
  }

  const prepareOpenReward = async () => {
    const contract = await getContract();
    try{
        let data = await contract.stopUserJoinGame()
        console.log(data)
    }catch(e) {
        alert(e)
    }
  }

  const startGame = async() => {
    const contract = await getContract();
    try{
        let data = await contract.startUserJoinGame()
        console.log(data)
    }catch(e) {
        alert(e)
    }
  }

  const saveHitNumber = async() => {
    const contract = await getContract();
    try{
        let data = await contract.setLotteryHitNumber(parseInt(hitNumber, 10))
        console.log(data)
    }catch(e) {
        alert(e)
    }
  }

  const announceReward = async() => {
    const contract = await getContract();
    try{
        let data = await contract.stopGame()
        console.log(data)
    }catch(e) {
        alert(e)
    }
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        {
          accounts.length > 0 ? (<div >{accounts[0]}</div>) : (
            <div onClick={onConnect}>connect wallet</div>
          )
        }
        {
            accounts.length > 0 ?(
                <div>
                    <div>
                        <input value={title} onChange={onChangeTitle}></input>标题
                    </div>
                    <div>
                        <input value={reward}  onChange={onChangeReward}></input>将金
                    </div>
                    <div>
                        <input value={maxUserJoinedNumber}  onChange={onChangeUserJoinedMaxNumber} disabled={nowStatus !== 0}></input>最多用户参与数
                    </div>
                    <div>
                        <input value={maxUserRewardNumber}  onChange={onChangeUserRewardMaxNumber} disabled={nowStatus !== 0}></input>最多用户中奖人数
                    </div>
                    <div>
                        <button onClick={saveData}>保存</button>
                    </div>
                    {
                      nowStatus === 2 ? (
                        <div>
                          <div>
                              <input value={hitNumber} onChange={onChangeHitNumber}></input>获奖数字
                          </div>
                          <div>
                              <button onClick={saveHitNumber}>设置获奖数字</button>
                          </div>
                        </div>
                      ):''
                    }
                    {
                      nowStatus === 3 ? (
                        <div>幸运数字：{hitNumber}</div>
                      ):''
                    }
                    <div>
                        {
                            nowStatus !== 0 ? (
                                <button>重新</button>
                            ):''
                        }
                        {
                            nowStatus === 0 ? (
                                <button onClick={startGame}>开始游戏</button>
                            ):''
                        }
                        {
                            nowStatus !== 2 ? (
                                <button onClick={prepareOpenReward}>开奖</button>
                            ):''
                        }
                        {
                            nowStatus !== 3 ? (
                                <button onClick={announceReward}>结束</button>
                            ):''
                        }
                    </div>
                </div>
            ):''
        }
      </main>
    </div>
  )
}