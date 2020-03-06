/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
pragma solidity ^0.5.0;

contract CheckSignature {
    string private constant prefix = "\u0019Ethereum Signed Message:\n32";

    function getSigner(bytes32 paramHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address signer) {
        bytes32 hash = keccak256(abi.encodePacked(prefix, paramHash));
        signer = ecrecover(hash, v, r, s);
    }

    function getHashToSign(string memory cdrId, address to, uint256 amount, address token) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(prefix, keccak256(abi.encodePacked(cdrId, to, amount, token))));
    }

    function getHash(string memory cdrId, address to, uint256 amount, address token) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(cdrId, to, amount, token));
    }

    function getTransferSigner(string memory cdrId, address to, uint256 amount, address token, uint8 v, bytes32 r, bytes32 s)
    public pure returns (address) {
        return getSigner(keccak256(abi.encodePacked(cdrId, to, amount, token)), v, r, s);
    }

}
