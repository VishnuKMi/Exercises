// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Write a function that takes in a block header and verifies its validity.

contract verifyBlock {

    struct BlockHeader {
        uint256 blockNumber;
        bytes32 prevBlockHash;
        bytes32 merkleRoot;
        uint256 timestamp;
        uint256 difficulty;
        uint256 nonce;
    }

    function verifyBlockHeader(BlockHeader memory header, bytes32[] memory txHashes) public view returns (bool) {
        if (header.blockNumber != block.number) {
            return false;
        }

        if (header.prevBlockHash != blockhash(header.blockNumber - 1)) {
            return false;
        }

        if (header.merkleRoot != getMerkleRoot(txHashes)) {
            return false;
        }

        if (header.timestamp > block.timestamp + 2 minutes) {
            return false;
        }

        if (header.difficulty != block.prevrandao) { // changed after beacon update.
            return false;
        }

        // The hash of the header must be less than or equal to this value in order for the block to be considered valid.
        bytes32 hash = keccak256(abi.encode(header.difficulty));
        if (uint(hash) > header.difficulty) {
            return false;
        }

        return true;
    }


    //function to find merkle root of txns.
    function getMerkleRoot(bytes32[] memory txHashes) internal pure returns(bytes32) {
        uint count = txHashes.length;
        if (count == 0) { // This block checks if the array is empty. If it is, the function immediately returns a zero hash value.
            return bytes32(0);
        }

        // This line starts a loop that continues as long as the count variable is greater than 1, indicating that there are still more than one transaction hashes in the array.
        while(count > 1) {

            // This for loop iterates through the array in pairs, computing the hash of each pair and storing it in the position of the first element of the pair in the array.
            // The sha256 function is used to compute the hash, and the abi.encodePacked function is used to concatenate the two hash values together into a single input for the sha256 function.
            for (uint i = 0; i < count-1 ; i += 2) {
                txHashes[i / 2] = sha256(abi.encodePacked(txHashes[i], txHashes[i+1]));
            }

            // This block handles the case where there is an odd number of transaction hashes in the array. In this case,
            // the last hash value in the array is paired with itself, and the resulting hash value is stored in the middle position of the array.
            if (count%2 != 0) {
                txHashes[count / 2] = sha256(abi.encodePacked(txHashes[count-1], txHashes[count-1]));
            }

            // This line updates the value of count to be half of its previous value, rounding up if the previous value was odd
            count = (count + 1) / 2; 
        }

        // Once the loop has completed, the Merkle root value is the first element in the txHashes array, and this value is returned as the output of the function.
        return txHashes[0]; 
    }

}