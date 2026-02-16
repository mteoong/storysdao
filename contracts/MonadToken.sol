// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StorydaoToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 100 * 10 ** 18;
    mapping(address => uint256) public lastFaucetTime;

    constructor() ERC20("Storysdao", "SDAO") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000_000 * 10 ** 18);
    }

    /// @notice Testnet faucet — claim 100 SDAO once per day
    function faucet() external {
        require(
            block.timestamp - lastFaucetTime[msg.sender] >= 1 days,
            "Wait 24h between claims"
        );
        lastFaucetTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }
}
