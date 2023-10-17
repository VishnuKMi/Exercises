// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test, console} from "forge-std/Test.sol";
import {DeployRaffle} from "../../script/DeployRaffle.sol";
import {Raffle} from "../../src/Raffle.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {Vm} from "forge-std/Vm.sol";
import {VRFCoordinatorV2Mock} from "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";

contract RaffleTest is Test {
    event EnteredRaffle(address indexed player);

    Raffle raffle;
    HelperConfig helperConfig;

    uint256 entranceFee;
    uint256 interval;
    address vrfCoordinator;
    bytes32 gasLane;
    uint64 subscriptionId;
    uint32 callbackGasLimit;
    address link;

    address public PLAYER = makeAddr("player");
    uint256 public constant STARTING_USER_BALANCE = 10 ether;

    function setUp() external {
        DeployRaffle deployer = new DeployRaffle();
        (raffle, helperConfig) = deployer.run();
        (
            entranceFee,
            interval,
            vrfCoordinator,
            gasLane,
            subscriptionId,
            callbackGasLimit,
            link,

        ) = helperConfig.activeNetworkConfig();
        vm.deal(PLAYER, STARTING_USER_BALANCE);
    }

    // Tests for 'enterRaffle()'

    function testRaffleInitializesInOpenState() public view {
        assert(raffle.getRaffleState() == Raffle.RaffleState.OPEN);
    }

    function testRaffleRevertsWhenYouDontPayEnough() public {
        // ARRANGE
        vm.prank(PLAYER);

        // ACT / ASSERT
        vm.expectRevert(Raffle.Raffle__NotEnoughEthSent.selector);
        raffle.enterRaffle();
    }

    function testRaffleRecordsPlayerWhenTheyEnter() public {
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();
        address playerRecorded = raffle.getPlayer(0);
        assert(playerRecorded == PLAYER);
    }

    function testEmitsEventOnEntrance() public {
        vm.prank(PLAYER);
        vm.expectEmit(true, false, false, false, address(raffle));
        emit EnteredRaffle(PLAYER);
        raffle.enterRaffle{value: entranceFee}(); // Fun that causes event emit
    }

    function testCantEnterWhenRaffleIsCalculating() public {
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();

        // To make 'checkUpkeep' return true values so that 'performUpkeep' function works fine.
        // We also need 'subscriptionId' and 'add consumer' from the mock contract of chainlink.
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        raffle.performUpkeep(""); // Makes Raffle state to CALCULATING

        vm.expectRevert(Raffle.Raffle__RaffleNotOpen.selector);
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();
    }

    // Tests for 'checkUpkeep()'
    function testCheckUpkeepReturnsFalseIfItHasNoBalance() public {
        // ARRANGE
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);

        // ACT
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");

        // ASSERT
        assert(!upkeepNeeded);
    }

    function testCheckUpkeepReturnsFalseIfRaffleNotOpen() public {
        // ARRANGE
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        raffle.performUpkeep("");

        // ACT
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");

        // ASSERT
        assert(upkeepNeeded == false);
    }

    function testCheckUpkeepReturnsFalseIfEnoughTimeHasntPassed() public {
        // ARRANGE
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();

        // ACT
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");

        // ASSERT
        assert(!upkeepNeeded);
    }

    function testCheckUpkeepReturnsTrueWhenParametersAreGood() public {
        // ARRANGE
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);

        // ACT
        (bool upkeepNeeded, ) = raffle.checkUpkeep("");

        // ASSERT
        assert(upkeepNeeded);
    }

    // Tests for 'performUpkeep()'
    function testPerformUpkeepCanOnlyRunIfCheckUpkeepIsTrue() public {
        // ARRANGE
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);

        raffle.performUpkeep("");
    }

    function testPerformUpkeepRevertsIfCheckUpkeepIsFalse() public {
        // ARRANGE
        uint256 currentBalance = 0;
        uint256 numPlayers = 0;
        uint256 raffleState = 0; // 0 is OPEN

        // ACT / ASSERT
        // vm.expectRevert(Raffle.Raffle__UpkeepNotNeeded(currentBalance, numPlayers, raffleState));
        vm.expectRevert(
            abi.encodeWithSelector(
                Raffle.Raffle__UpkeepNotNeeded.selector,
                currentBalance,
                numPlayers,
                raffleState
            )
        );
        raffle.performUpkeep("");
    }

    modifier raffleEnteredAndTimePassed() {
        vm.prank(PLAYER);
        raffle.enterRaffle{value: entranceFee}();
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        _;
    }

    function testPerformUpkeepUpdatesRaffleStateAndEmitsRequestId()
        public
        raffleEnteredAndTimePassed
    {
        // ACT
        vm.recordLogs();
        raffle.performUpkeep("");
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bytes32 requestId = entries[1].topics[1]; // 0th entry would be the event emitted from actual VRF Mock contract here.
        // Similarly 0th topic would be whole of 'RequestedRaffleWinner(requestId)' and 1st topic would be just 'requestId'.

        Raffle.RaffleState rState = raffle.getRaffleState();

        assert(uint256(requestId) > 0);
        assert(uint256(rState) == 1); // 1 is 'CALCULATING' state
    }

    // Actual vrf contract has diff setup for 'fulfillRandomWords' func.
    modifier skipFork() {
        if (block.chainid != 31337) {
            return;
        }
        _;
    }

    function testFulfillRandomWordsCanOnlyBeCalledAfterPerformUpkeep(
        uint256 randomRequestId
    ) public raffleEnteredAndTimePassed skipFork {
        // ARRANGE
        vm.expectRevert("nonexistent request");
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            randomRequestId,
            address(raffle)
        );
    }

    function testFulfillRandomWordsPicksWinnerResetsAndSendsMoney()
        public
        raffleEnteredAndTimePassed // 1st person already entered Raffle
        skipFork
    {
        // ARRANGE
        uint256 additionalEntrants = 5; // 5 more to enter Raffle
        uint256 startingIndex = 1; // 0th index is taken by 1st person
        for (
            uint256 i = startingIndex;
            i < startingIndex + additionalEntrants;
            i++
        ) {
            // address player = makeAddr("player");
            address player = address(uint160(i));
            hoax(player, STARTING_USER_BALANCE);
            raffle.enterRaffle{value: entranceFee}();
        }

        uint256 prize = entranceFee * (additionalEntrants + 1);

        vm.recordLogs();
        raffle.performUpkeep("");
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bytes32 requestId = entries[1].topics[1]; // ReqId is of type bytes32 here becuz of 'Vm.Log'. We can type-cast to uint256 when needed.

        uint256 previousTimestamp = raffle.getLastTimestamp();

        // Pretend to be chainlink vrf to get random no & pick winner.
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            uint256(requestId),
            address(raffle)
        );

        // ASSERT
        assert(uint256(raffle.getRaffleState()) == 0); // Raffle should be OPEN once winner is selected.
        assert(raffle.getRecentWinner() != address(0)); // Raffle needs winner stored to state variable 's_recentWinner'.
        assert(raffle.getLengthOfPlayers() == 0); // Raffle's players array should be reset once winner is selected.
        assert(previousTimestamp < raffle.getLastTimestamp());
        // Check for event emitted 'PickedWinner'
        assert(
            raffle.getRecentWinner().balance ==
                STARTING_USER_BALANCE + prize - entranceFee
        );
    }
}
