import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

export default function App() {
  const [web3, setWeb3] = useState("");
  const [storageValue, setStorageValue] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState("");
  const [userValue, setUserValue] = useState(1);

  useEffect(() => {
    connectWeb3();

    async function connectWeb3() {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
      }
    }
  }, []);

  async function handleDoStuff() {
    console.log(`web3`, web3);
    console.log(`accounts`, accounts);
    console.log(`contract`, contract);

    // store user value value
    await contract.methods.set(userValue).send({
      from: accounts[0],
    });

    const response = await contract.methods.get().call();

    setStorageValue(response);
  }

  if (!web3) return `Loading web 3...`;

  return (
    <>
      {storageValue && <h1>Successfully saved value: {storageValue}</h1>}
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          handleDoStuff();
        }}
      >
        <input
          type="tel"
          value={userValue}
          onChange={(e) => setUserValue(e.target.value)}
        />
        <button type="submit">do stuff</button>
      </form>
    </>
  );
}
