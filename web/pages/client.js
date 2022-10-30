import Head from 'next/head'
import { useEffect, useState } from 'react'
import { contractAddress, contractABI } from './../lib/web3';
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
  const [joinList, setJoinList] = useState([]);

  useEffect(() => {
    window.ethereum.request({ method: "eth_accounts" }).then(setAccounts);
    fetchLotteryStatus();
    fetchLotteryTitle();
    fetchLotteryReward();
  }, [])

  const onConnect = async () => {
    window.ethereum.request({ method: "eth_requestAccounts" }).then(setAccounts);
  }

  const fetchLotteryStatus = async () => {
    let contract = await getContract();
    contract.getNowStatus.call().then(setNowStatus);
  }

  const fetchLotteryTitle = async () => {
    let contract = await getContract();
    contract.getNowLotteryTitle.call().then(setTitle);
  }

  const fetchLotteryReward = async () => {
    let contract = await getContract();
    contract.getNowLotteryReward.call().then(setReward);
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
          nowStatus === 0 ? (
            <div>暂未开始</div>
          ) : ''
        }
        {
          nowStatus === 1 ? (
            <div>进行中</div>
          ) : ''
        }
        {
          nowStatus === 2 ? (
            <div>待开奖</div>
          ) : ''
        }
        {
          nowStatus === 3 ? (
            <div>已结束</div>
          ) : ''
        }
        <div>标题：{title}</div>
        <div>奖励：{reward}</div>
        <div>参与任务：{joinList.length}人</div>
      </main>
    </div>
  )
}