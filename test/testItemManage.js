const ItemManager = artifacts.require("./ItemManager.sol");

contract("ItemManager", (accounts) => {
  it(".. should be able to add an Item", async () => {
    const itemManagerInstance = await ItemManager.deployed();

    const itemName = "Test 2";
    const itemPrice = 500;

    const result = await itemManagerInstance.createItem(itemName, itemPrice, {
      from: accounts[0],
    });

    assert.equal(result.logs[0].args._itemIndex, 0, "It must be zero");
    //assert.equal(0, 0, "testss");
  });
});
