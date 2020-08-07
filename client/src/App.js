import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, cost: 0, itemName: "example 1" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      this.itemManager = new web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[networkId] &&
          ItemManagerContract.networks[networkId].address
      );

      this.item = new web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[networkId] &&
          ItemContract.networks[networkId].address
      );

      this.listenToPaymentEvent();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleCreate = async (event) => {
    const { itemName, cost } = this.state;

    const result = await this.itemManager.methods
      .createItem(itemName, cost)
      .send({ from: this.accounts[0] });

    console.log(result);

    alert(
      "Send + " +
        cost +
        "Wei to " +
        result.events.SupplyChainStep.returnValues._itemAddress
    );
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data", async (event) => {
      console.log(event);
      let itemObj = await self.itemManager.methods
        .items(event.returnValues._itemIndex)
        .call();
      console.log(itemObj);
    });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Supply Chain Example</h1>
        <h2>Items</h2>
        <h2>Add Items</h2>
        Cost in Wei :
        <input
          type="text"
          name="cost"
          value={this.state.cost}
          onChange={this.handleInputChange}
        />
        Item Identifier :
        <input
          type="text"
          name="itemName"
          value={this.state.itemName}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleCreate}> cCreate new Item</button>
      </div>
    );
  }
}

export default App;
