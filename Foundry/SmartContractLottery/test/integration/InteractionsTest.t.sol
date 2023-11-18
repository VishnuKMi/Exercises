// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {CreateSubscription, FundSubscription, AddConsumer} from "../../script/Interactions.s.sol";

contract InteractionsTest is Test {
    address vrfCoordinator;
    uint64 subId;
    address link;
    uint256 deployerKey;
    CreateSubscription createSubscription;
    FundSubscription fundSubscription;
    AddConsumer addConsumer;

    modifier skipFork() {
        if (block.chainid != 31337) {
            return;
        }
        _;
    }

    function setUp() external {
        HelperConfig helperConfig = new HelperConfig();
        (, , vrfCoordinator, , subId, , link, deployerKey) = helperConfig
            .activeNetworkConfig();

        vm.startBroadcast();
        createSubscription = new CreateSubscription();
        fundSubscription = new FundSubscription();
        addConsumer = new AddConsumer();
        vm.stopBroadcast();
    }

    function testCreateSubscriptionCreatesSubscription() public skipFork {
        uint64 subID = createSubscription.run();
        assertEq(subID, 1);
    }

    function testFundSubscriptionFundsSubscription() public skipFork {
        uint64 subID = createSubscription.createSubscription(
            vrfCoordinator,
            deployerKey
        );

        vm.recordLogs();
        fundSubscription.fundSubscription(
            vrfCoordinator,
            subID,
            link,
            deployerKey
        );
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bytes32 subIdFromEvent = entries[0].topics[1];
        assertEq(uint256(subIdFromEvent), uint256(subID));
    }

    function testAddConsumerAddsConsumer() public skipFork {
        uint64 subID = createSubscription.createSubscription(
            vrfCoordinator,
            deployerKey
        );
        vm.recordLogs();
        addConsumer.addConsumer(
            address(this),
            vrfCoordinator,
            subID,
            deployerKey
        );
        Vm.Log[] memory entries = vm.getRecordedLogs();

        bytes32 subIdFromEvent = entries[0].topics[1];
        bytes32 consumerAddrFromEvent = bytes32(entries[0].data);
        assertEq(uint256(subIdFromEvent), uint256(subID));
        assertEq(
            address(uint160(uint256(consumerAddrFromEvent))),
            address(this)
        );
    }
}
