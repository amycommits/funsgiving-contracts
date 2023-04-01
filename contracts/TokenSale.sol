// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IMyERC20Token is IERC20 {
    function mint(address to, uint256 amount) external;
    function burnFrom(address to, uint256 amount) external;
}

contract TokenSale {
    ///@notice Purchase ratio between sale erc20 and ether
 
    uint256 public erc20purchaseratio;
    IMyERC20Token public paymentToken;

        constructor(uint256 _ratio, address _paymentToken) {
            erc20purchaseratio = _ratio;
            paymentToken = IMyERC20Token(_paymentToken);
        }

    function purchaseTokens() public payable  {
        uint256 etherReceived = msg.value;
        uint256 tokensToBeEarned = msg.value / erc20purchaseratio;
        paymentToken.mint(msg.sender, tokensToBeEarned);
    }

    function burnTokens(uint256 amount) public {
        paymentToken.burnFrom(msg.sender, amount);
    }
}
