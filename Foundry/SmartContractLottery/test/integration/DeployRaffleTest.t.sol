// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {DeployRaffle} from "../../script/DeployRaffle.s.sol";
import {Raffle} from "../../src/Raffle.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";

contract DeployRaffleTest is Test {

  function setUp() external {}

  function testDeployRaffleCorrectlyDeploysRaffle() public {
    DeployRaffle deployer = new DeployRaffle();
    (Raffle raffle, HelperConfig helperConfig) = deployer.run();
    assert(uint160(address(raffle)) > 0);
    assert(uint160(address(helperConfig)) > 0);
  }

}
