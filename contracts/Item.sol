// SPDX-License-Identifier: Private
pragma solidity ^0.7.0;
import "./ItemManager.sol";

contract Item {
    uint256 public priceInWei;
    uint256 public index;
    uint256 pricePaid;

    ItemManager parentContract;

    constructor(
        ItemManager _parentCOntract,
        uint256 _priceInWei,
        uint256 _index
    ) public {
        priceInWei = _priceInWei;
        parentContract = _parentCOntract;
        index = _index;
    }

    receive() external payable {
        require(pricePaid == 0, "Item is already paid");
        require(priceInWei == msg.value, "Need full payments");
        pricePaid += msg.value;
        // (bool success, ) = address(parentContract).call.value(msg.value)(abi.encodeWithSignature("triggerPayment(uint256)", index));
        (bool success, ) = address(parentContract).call{value: msg.value}(
            abi.encodeWithSignature("triggerPayment(uint256)", index)
        );

        require(success == true, "The transaction was unsuccessful");
    }

    fallback() external {}
}
