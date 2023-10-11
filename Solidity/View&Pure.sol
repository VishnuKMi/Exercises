// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract ViewAndPure {

    //declare a state variable
    uint public x = 1;

    //promise not to modify the state (but can read the state)
    function addToX(uint y) public view returns (uint) {
        return x + y;
    }

    //promise not to read or modify from state
    function add(uint i, uint j) public pure returns (uint) {
        return i + j;
    }
}
