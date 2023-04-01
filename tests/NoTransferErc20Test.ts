import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { NoTransERC20 } from "../typechain-types"
import { expect } from "chai";
import exp from "constants";

describe("notranserc20", async () => {
    let erc20Token: NoTransERC20;
    let deployer: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;

    beforeEach(async () => {
        [deployer, acc1, acc2] = await ethers.getSigners();
        const erc20TokenFactory = await ethers.getContractFactory("NoTransERC20")
        erc20Token = await erc20TokenFactory.connect(deployer).deploy("hello", "ext")
        await erc20Token.deployed();
      });

    describe("When erc20 is deployed", async () => {
        it("is owned and mintable by deployer", async () => {
            const minter_role = await erc20Token.MINTER_ROLE()
            const bool = await erc20Token.hasRole(minter_role, deployer.address)
            expect(bool).to.equal(true);
        })
        it("mints tokens to an address, tokens are non-transferrable", async () => {
            const mint = await erc20Token.mint(acc1.address, 100)
            const balance = await erc20Token.balanceOf(acc1.address)
            expect(balance).to.equal(100)
            await expect(erc20Token.transfer(acc2.address, 10)).to.be.revertedWith("ERC20: don't allow transfers")
        })
    })
})