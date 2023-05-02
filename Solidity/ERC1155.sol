// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC1155, Ownable {

    uint256[] public minRate = [0.05 ether, 1 ether, 0.025 ether];
    uint256[] public supplies = [50, 100, 200];
    uint256[] public minted = [0, 0, 0];

      constructor() ERC1155("https://api.mysite.com/tokens{id") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount)
        payable
        public
        onlyOwner
    {
        uint256 index = id-1;
        require(id <= supplies.length && id > 0, "Token doesn't exist");
        require(msg.value >= (amount * minRate[index]), "ether not enough");
        require(minted[index] + amount <= supplies[index], "supply over");

        _mint(account, id, amount, "");
        minted[index] += amount;
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Balance is 0");
        payable(owner()).transfer(address(this).balance);
    }
}
