// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions

// SPDX-License-Identifier: minutes
pragma solidity ^0.8.18;

/**
 * @author  Vishnu KM .
 * @title   A sample Raffle Contract .
 * @dev     Implements Chainlink VRFv2 .
 * @notice  This contract is for creating a sample raffle .
 */

contract Raffle {
    error Raffle__NotEnoughEthSent();

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    event EnteredRaffle(address indexed player);

    constructor(uint256 entraceFee) {
        i_entranceFee = entraceFee;
    }

    function enterRaffle() external payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughEthSent();
        }
        s_players.push(payable(msg.sender));

        emit EnteredRaffle(msg.sender);
    }

    function pickWinner() public {}

    /** Getter Function */

    function getEntraceFee() external view returns (uint256) {
        return i_entranceFee;
    }
}
