import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { NoTransERC20, MyERC20Token, CharityPaymentSplitter, NoTransERC20__factory, MyToken } from "../typechain-types"
import { expect } from "chai";
import { Address } from "cluster";

describe("charity payment splitter", async () => {
    let erc20Token: MyERC20Token;
    let charityPaymentSplitter: CharityPaymentSplitter;
    let deployer: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;
    let noTransErc20Token: string;
    let nftToken: MyToken;

    beforeEach(async () => {
        [deployer, acc1, acc2] = await ethers.getSigners();
        // deploy erc20 token 
        const erc20TokenFactory = await ethers.getContractFactory("MyERC20Token")
        erc20Token = await erc20TokenFactory.connect(acc1).deploy();
        await erc20Token.deployed();
        await erc20Token.mint(acc1.address, 100)
        // deploy splitter contract
        const charityPaymentSpliiterFactory = await ethers.getContractFactory("CharityPaymentSplitter")
        charityPaymentSplitter = await charityPaymentSpliiterFactory.deploy([deployer.address, acc2.address], [90, 10], "hello");
        const noTransErc20Token = await charityPaymentSplitter.erc20Receipt()
        // deploy nft with revenue split
        const nftFactory = await ethers.getContractFactory("MyToken")
        nftToken = await nftFactory.connect(deployer).deploy(
                charityPaymentSplitter.address,
                erc20Token.address,
                2,
                50
            )
        
      });
      describe("when split contract receives erc20 tokens", async () => {
          it("mints a receipt token", async () => {

            // approve spending of 50 usdc
            erc20Token.approve(charityPaymentSplitter.address, 50)

            // send 50 usdc to charity
            await charityPaymentSplitter.connect(acc1).receiveERC20(50, acc1.address, erc20Token.address);

            const charityErc20Balance = await erc20Token.balanceOf(charityPaymentSplitter.address)
            expect(charityErc20Balance).to.equal(50)
            // connect to erc20receipt contract to check receipt balance
            noTransErc20Token = await charityPaymentSplitter.erc20Receipt()
            const noTransErc20Contract = NoTransERC20__factory.connect(noTransErc20Token, deployer)
            const erc20Receipt = await noTransErc20Contract.balanceOf(acc1.address)
            expect(erc20Receipt).to.equal(50)

            // try to claim money from charity contract, 90% to deployer, 10% to acc2
            await charityPaymentSplitter.connect(acc2)["release(address,address)"](erc20Token.address, acc2.address)
            await charityPaymentSplitter.connect(deployer)["release(address,address)"](erc20Token.address, deployer.address)
            const erc20Balanceacc2 = await erc20Token.balanceOf(acc2.address)
            const erc20BalanceDeployer = await erc20Token.balanceOf(deployer.address)
            expect(erc20Balanceacc2).to.equal(5)
            expect(erc20BalanceDeployer).to.equal(45)
            
          })
      })
      describe("When NFT collection is minted", async () => {
          it("sends a percentage to charity", async () => {
            // expect insufficient allowance
            await expect(nftToken.safeMint(acc1.address)).to.be.revertedWith("ERC20: insufficient allowance")

            //give allowance
            await erc20Token.approve(nftToken.address, 2)
            //mint
            await nftToken.connect(acc1).safeMint(acc1.address)
            const ownerAddress = await nftToken.ownerOf(0)
            expect(ownerAddress).to.equal(acc1.address)
            const erc20Balance = await erc20Token.balanceOf(acc1.address)
            expect(erc20Balance).to.eq(98)
            // check for erc20 balance of charity split and nft contracts
            const charityBalance = await erc20Token.balanceOf(charityPaymentSplitter.address)
            const nftBalance = await erc20Token.balanceOf(nftToken.address)
            expect(charityBalance).to.eq(1)
            expect(nftBalance).to.eq(1)
            // check receipt balance
            noTransErc20Token = await charityPaymentSplitter.erc20Receipt()
            const noTransErc20Contract = NoTransERC20__factory.connect(noTransErc20Token, deployer)
            const acc1ReceiptBalance = await noTransErc20Contract.balanceOf(acc1.address)
            expect(acc1ReceiptBalance).to.eq(1)
          })
      })
} )