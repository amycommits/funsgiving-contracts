// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { expect } from "chai";
// import { BigNumber } from "ethers";
// import { ethers } from "hardhat";
// import { MyERC20Token, TokenSale } from "../typechain-types"

// const ERC20_TOKEN_RATIO = 5;
// describe("NFT Shop", async () => {

//   let tokenSaleContract: TokenSale;
//   let erc20Token: MyERC20Token;
//   let deployer: SignerWithAddress;
//   let acc1: SignerWithAddress;
//   let acc2: SignerWithAddress;

//   beforeEach(async () => {
//     [deployer, acc1, acc2] = await ethers.getSigners();
//     const erc20TokenFactory = await ethers.getContractFactory("MyERC20Token")
//     erc20Token = await erc20TokenFactory.deploy();
//     await erc20Token.deployed();
//     const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale");
//     tokenSaleContract = await tokenSaleContractFactory.deploy(ERC20_TOKEN_RATIO, erc20Token.address);
//     await tokenSaleContract.deployed();
//     const MINTER_ROLE = await erc20Token.MINTER_ROLE()
//     const grantRoleTx = await erc20Token.grantRole(
//       MINTER_ROLE,
//       tokenSaleContract.address
//     )
//     await grantRoleTx.wait()
//   });

//   describe("When the Shop contract is deployed", async () => {
//     it("defines the ratio as provided in parameters", async () => {
//       const rate = await tokenSaleContract.erc20purchaseratio();
//       expect(rate).to.equal(ERC20_TOKEN_RATIO)
//     });

//     it("uses a valid ERC20 as payment token", async () => {
//       const paymentTokenAddress = await tokenSaleContract.paymentToken()
//       expect(paymentTokenAddress).to.eq(erc20Token.address)
//       const erc20TokenFactory = await ethers.getContractFactory("MyERC20Token")
//       const paymentTokenContract = erc20TokenFactory.attach(paymentTokenAddress)
//       const myBalance = await paymentTokenContract.balanceOf(deployer.address)
//       expect(myBalance).to.equal(0)
//       const totalSupply = await paymentTokenContract.totalSupply();
//       expect(totalSupply).to.equal(0);
     
      
//     });
//   });

//   describe("When a user purchase an ERC20 from the Token contract", async () => {
//     let amountToBeSentBn = ethers.utils.parseEther("1");
//     let balanceBeforeBn: BigNumber;
//     const amountToBeReceived = amountToBeSentBn.div(ERC20_TOKEN_RATIO)
//     let purchasegasCosts: BigNumber; 
//     beforeEach(async () => {
//       balanceBeforeBn =  await acc1.getBalance();
//       const purchaseTokensTx = await tokenSaleContract
//         .connect(acc1)
//         .purchaseTokens({ value: amountToBeSentBn });
//       const purchaseTokensReceipt = await purchaseTokensTx.wait();
//       const gasUnitsUsed = purchaseTokensReceipt.gasUsed;
//       const gasPrice = purchaseTokensReceipt.effectiveGasPrice;
//       purchasegasCosts = gasUnitsUsed.mul(gasPrice)
//     })
//      it("charges the correct amount of ETH", async () => {
//       const balanceAfterBn = await acc1.getBalance()
//       const diff = balanceBeforeBn.sub(balanceAfterBn)
//       const expectedDiff = amountToBeSentBn.add(purchasegasCosts)

//       const err = diff.sub(expectedDiff)
//       expect(err).to.eq(0)
//     });

//     it("gives the correct amount of tokens", async () => {
//       const acc1Balance = await erc20Token.balanceOf(acc1.address)
//       expect(acc1Balance).to.equal(amountToBeReceived);
//     });

//     it("increases the balance of ETH in the contract", async () => {
//       const balanceAfterBn = await acc1.getBalance()
//       const diff = balanceBeforeBn.sub(balanceAfterBn)
//       const expectedDiff = amountToBeSentBn.add(purchasegasCosts)

//       const err = diff.sub(expectedDiff)
//       expect(err).to.eq(0)
//     });


//     describe("When a user burns an ERC20 at the Token contract", async () => {
//       let approveGasCosts: BigNumber;
//       let burngasCosts: BigNumber; 
//       beforeEach(async () => {
//         const approveTokensTx = await erc20Token
//         .connect(acc1)
//         .approve(tokenSaleContract.address, amountToBeReceived);
//         const approveTokensReceipt = await approveTokensTx.wait();
//         const approvegasUnitsUsed = approveTokensReceipt.gasUsed;
//         const approvegasPrice = approveTokensReceipt.effectiveGasPrice;
//         approveGasCosts = approvegasUnitsUsed.mul(approvegasPrice)
//         const burnTokensTx = await tokenSaleContract
//           .connect(acc1)
//           .burnTokens(amountToBeReceived);
//         const burnTokensReceipt = await burnTokensTx.wait();
//         const gasUnitsUsed = burnTokensReceipt.gasUsed;
//         const gasPrice = burnTokensReceipt.effectiveGasPrice;
//         burngasCosts = gasUnitsUsed.mul(gasPrice)
//       })
//       it("gives the correct amount of ETH", async () => {
//         throw new Error("Not implemented");
//       });

//       it("burns the correct amount of tokens", async () => {
//         throw new Error("Not implemented");
//       });
//     });
//   });
//   describe("When a user purchase a NFT from the Shop contract", async () => {
//     it("charges the correct amount of ETH", async () => {
//       throw new Error("Not implemented");
//     });

//     it("updates the owner account correctly", async () => {
//       throw new Error("Not implemented");
//     });

//     it("update the pool account correctly", async () => {
//       throw new Error("Not implemented");
//     });

//     it("favors the pool with the rounding", async () => {
//       throw new Error("Not implemented");
//     });
//   });

//   describe("When a user burns their NFT at the Shop contract", async () => {
//     it("gives the correct amount of ERC20 tokens", async () => {
//       throw new Error("Not implemented");
//     });
//     it("updates the pool correctly", async () => {
//       throw new Error("Not implemented");
//     });
//   });

//   describe("When the owner withdraw from the Shop contract", async () => {
//     it("recovers the right amount of ERC20 tokens", async () => {
//       throw new Error("Not implemented");
//     });

//     it("updates the owner account correctly", async () => {
//       throw new Error("Not implemented");
//     });
//   });
// });