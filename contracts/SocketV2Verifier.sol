// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "hardhat/console.sol";

contract SocketV2Verifier {
    function verifyCallData(bytes calldata _data) public pure returns (bool verified) {
        return true;
    }
}
