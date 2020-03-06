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

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Settlement is Ownable {
    using SafeMath for uint256;

    // struct Withdrawal {
    //     uint256 amount;
    //     address token;
    //     uint256 timestamp;
    // }

    // token => (holder => balance)
    mapping(address => mapping(address => uint256)) public tokenBalances;
    // signer => (cdrId => withdrawn)
    mapping(address => mapping(string => bool)) private withdrawals;

    // the owner can transfer arbitrary token amounts. this should only be used in extreme cases
    function transferTokens(address recipient, uint256 amount, address token) public onlyOwner {
        IERC20(token).transfer(recipient, amount);
    }

    // provision an account. the recipient is the address of the future spender
    function transferInto(address recipient, uint256 amount, address token) public {
        //get the tokens
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        //increase the token balance in the payment contract
        tokenBalances[token][recipient] = tokenBalances[token][recipient].add(amount);
    }

    string constant private prefix = "\u0019Ethereum Signed Message:\n32";
    function transfer(string memory cdrId, address to, uint256 amount, address token, uint8 v, bytes32 r, bytes32 s)
    public {
        bytes32 paramHash = keccak256(abi.encodePacked(cdrId, to, amount, token));
        address signer = ecrecover(keccak256(abi.encodePacked(prefix, paramHash)), v, r, s);
        require(withdrawals[signer][cdrId] == false, "Funds already withdrawn for CDR with that ID");
        //SafeMath ensures that the signer has enough tokens in their payment account
        tokenBalances[token][signer] = tokenBalances[token][signer].sub(amount);
        withdrawals[signer][cdrId] = true;
        IERC20(token).transfer(to, amount);
    }

}
