// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "./NoTransERC20.sol";

contract CharityPaymentSplitter is PaymentSplitter {

    NoTransERC20 public erc20Receipt;
    string public charityName;
    uint private currentYear; 


    constructor(
        address[] memory _payees,
        uint256[] memory _shares,
        string memory _name
    ) PaymentSplitter(_payees, _shares) { 

        erc20Receipt = new NoTransERC20(_name, "receipt");
        currentYear = (block.timestamp / 31557600) + 1970; 
        charityName = _name;
    }

    function receiveERC20(uint256 amount, address from, address erc20Address) public {
        ERC20(erc20Address).transferFrom(msg.sender, address(this), amount);
        NoTransERC20(erc20Receipt).mint(from, amount);
    }

}