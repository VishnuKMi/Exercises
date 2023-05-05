// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Implement a Merkle tree data structure and use it to validate a set of transactions.

contract MerkleTree {

    function verifyTxnSet(bytes32[] memory txns, bytes32[] memory proof, uint index, bytes32 root) public pure returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(txns[index]));
        for (uint i = 0; i < proof.length; i++) {
            if (index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, proof[i]));
            } else {
                hash = keccak256(abi.encodePacked(proof[i], hash));
            }
            index /= 2; //  To move up to the next level of the tree.
        }
        return hash == root;
    }

    function constructTree(bytes32[] memory txns) public pure returns (bytes32) { // Returns root hash of the Merkle tree.
        uint n = txns.length;
        bytes32[] memory nodes = new bytes32[](n * 2); // Array to hold the Merkle tree nodes.

        for (uint i = 0; i < n; i++) { // This loop populates the bottom layer of the Merkle tree with the hashes of the input transactions.
            nodes[n + i] = keccak256(abi.encodePacked(txns[i]));
        }
        for (uint i = n - 1; i > 0; i--) { // This loop recursively combines pairs of adjacent nodes to create higher layers of the Merkle tree, until the root hash is obtained.
            nodes[i] = keccak256(abi.encodePacked(nodes[i * 2], nodes[i * 2 + 1]));
        }
        return nodes[1];
    }

}