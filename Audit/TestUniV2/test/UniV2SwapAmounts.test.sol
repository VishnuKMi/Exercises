// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.2;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IWETH} from "../src/interfaces/IWETH.sol";
import {IUniswapV2Router02} from "../src/interfaces/IUniswapV2Router02.sol";

import {DAI, WETH, MKR, UNI_V2_ROUTER_02} from "../constants/Addresses.sol";

contract UniV2SwapAmountsTest is Test {
    IWETH private constant weth = IWETH(WETH);
    IERC20 private constant dai = IERC20(DAI);
    IERC20 private constant mkr = IERC20(MKR);
    IUniswapV2Router02 private constant router = IUniswapV2Router02(UNI_V2_ROUTER_02);

    function setUp() public {
        // Optional: give test address some ETH for gas
        vm.deal(address(this), 10 ether);
    }

    function test_forkedRouterExists() public {
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(UNI_V2_ROUTER_02)
        }
        console2.log("Router code size:", codeSize);
        assert(codeSize > 0); // should pass on fork
    }

    function test_getAmountsOut() public {
        uint256 amountIn = 1 ether; // 1 WETH

        address[] memory path = new address[](3);
        path[0] = WETH;
        path[1] = DAI;
        path[2] = MKR;

        uint256[] memory amountsOut = router.getAmountsOut(amountIn, path);

        console2.log("WETH -> DAI -> MKR");
        console2.log("DAI out:", amountsOut[1] / 1e18);
        console2.log("MKR out:", amountsOut[2] / 1e18);
    }

    function test_getAmountsIn() public {
        uint256 amountOut = 1e15; // 0.001 MKR

        address[] memory path = new address[](3);
        path[0] = WETH;
        path[1] = DAI;
        path[2] = MKR;

        uint256[] memory amountsIn = router.getAmountsIn(amountOut, path);

        console2.log("WETH -> DAI -> MKR");
        console2.log("WETH needed:", amountsIn[0] / 1e18);
        console2.log("DAI needed:", amountsIn[1] / 1e18);
    }
}
