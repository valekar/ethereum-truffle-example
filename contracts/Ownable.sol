// SPDX-License-Identifier: Private
pragma solidity ^0.7.0;

contract Ownable {
    address payable _owner;

    constructor() public {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(isOwner(), "You are not the owner");
        _;
    }

    function isOwner() public view returns (bool) {
        return (_owner == msg.sender);
    }
}
