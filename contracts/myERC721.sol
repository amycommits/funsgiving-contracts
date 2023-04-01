// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./CharityPaymentSplitter.sol";

contract MyToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    address tokenAddress;
    uint256 price;
    address payable splitterAddress;
    uint256 percentShare;

    Counters.Counter private _tokenIdCounter;

    constructor(address payable _splitterAddress, address _tokenAddress, uint256 _price, uint256 _percentShare) ERC721("MyToken", "MTK") {
        tokenAddress = _tokenAddress;
        price = _price;
        splitterAddress = _splitterAddress;
        percentShare = _percentShare;
    }

    function safeMint(address to) public {
        // auto-increment
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        // percentage donage to charity
        uint256 amountToCharity = (price * percentShare)/100;
        ERC20(tokenAddress).transferFrom(to, address(this), price);
        ERC20(tokenAddress).approve(splitterAddress, price);
        CharityPaymentSplitter(splitterAddress).receiveERC20(amountToCharity, msg.sender, tokenAddress);
        // mint after donation split
        _safeMint(to, tokenId);
    }
}