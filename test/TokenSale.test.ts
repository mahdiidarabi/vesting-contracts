// import { expect, use } from "chai"
// import { deployments, ethers } from "hardhat"
// import { Signer, BigNumber, BigNumberish } from "ethers"
// import { deployMockContract,MockContract } from "@ethereum-waffle/mock-contract";
// import { Address } from "hardhat-deploy/dist/types";
// import { solidity, MockProvider } from "ethereum-waffle"
// import { Contract } from "@ethersproject/contracts";
// import { exitCode } from "process";
// import exp from "constants";

// import { ICOLogic } from "../typechain/ICOLogic"
// import { ICOLogic__factory } from "../typechain/factories/ICOLogic__factory"

// import { ICOProxy } from "../typechain/ICOProxy"
// import { ICOProxy__factory } from "../typechain/factories/ICOProxy__factory"

// import { WrappedERC20Token } from "../typechain/WrappedERC20Token"
// import { WrappedERC20Token__factory } from "../typechain/factories/WrappedERC20Token__factory"

// const {
//     advanceBlockWithTime,
//     takeSnapshot,
//     revertProvider,
// } = require("./utils");

// use(solidity)

// describe("AtlantisTokenSale", async () => {
//     let snapshotId: any;

//     let startDate = 0;
//     const tillStart = 2000;
//     const duration = 10000;

//     const asNativeAddress = "0x1111111111111111111010101010101010101010";
//     const nilAddress = "0x0000000000000000000000000000000000000000";

//     let saleOwner: Signer
//     let signer1: Signer
//     let signer2: Signer
//     let signer3: Signer
//     let signer4: Signer
//     let fundingWallet: Signer
    

//     let saleOwnerAddr: Address
//     let signer1Addr: Address
//     let signer2Addr: Address
//     let signer3Addr: Address
//     let signer4Addr: Address
//     let fundWalletAddr: Address

//     let theToken: WrappedERC20Token
//     let baseToken1: WrappedERC20Token
//     let baseToken2: WrappedERC20Token
//     let baseToken3: WrappedERC20Token
//     let baseToken4: WrappedERC20Token

//     let theTokenAddress: string
//     let baseToken1Addr: string    
//     let baseToken2Addr: string    
//     let baseToken3Addr: string    
//     let baseToken4Addr: string    

//     let oracle1: MockContract;
//     let oracle2: MockContract;
//     let oracle3: MockContract;
//     let oracle4: MockContract;

//     let oracle1Addr: string
//     let oracle2Addr: string
//     let oracle3Addr: string
//     let oracle4Addr: string


//     const oneUnit = BigNumber.from(10).pow(18)
//     const oneHundred = BigNumber.from(10).pow(18).mul(100);
//     const twoHundred = BigNumber.from(10).pow(18).mul(200);
//     const threeHundred = BigNumber.from(10).pow(18).mul(300);
//     const fourHundred = BigNumber.from(10).pow(18).mul(400);
//     const oneThousand = BigNumber.from(10).pow(18).mul(1000);
//     const fiveThousand = BigNumber.from(10).pow(18).mul(5000);

//     const epsilon = BigNumber.from(10).pow(18)

//     let ico: Contract


//     const zeroTokenAddrs: [
//         string,
//         string,
//         string, 
//         string,
//     ] = [
//         nilAddress, 
//         nilAddress,
//         nilAddress, 
//         nilAddress,
//     ]

//     const zeroOracleAddrs: [
//         string,
//         string,
//         string, 
//         string,
//     ] = [
//         nilAddress, 
//         nilAddress,
//         nilAddress, 
//         nilAddress,
//     ]

//     before("initial signers", async () => {
//         [saleOwner, signer1, signer2, signer3, signer4, fundingWallet] = await ethers.getSigners()
//         saleOwnerAddr = await saleOwner.getAddress()
//         signer1Addr = await signer1.getAddress()
//         signer2Addr = await signer2.getAddress()
//         signer3Addr = await signer3.getAddress()
//         signer4Addr = await signer4.getAddress()
//         fundWalletAddr = await fundingWallet.getAddress()
//     })

//     beforeEach(async () => {
//         snapshotId = await takeSnapshot(signer1.provider);

//         theToken = await deploybep20Token()
//         theTokenAddress = theToken.address

//         baseToken1 = await deploybep20Token()
//         baseToken1Addr = baseToken1.address

//         baseToken2 = await deploybep20Token()
//         baseToken2Addr = baseToken2.address

//         baseToken3 = await deploybep20Token()
//         baseToken3Addr = baseToken3.address

//         baseToken4 = await deploybep20Token()
//         baseToken4Addr = baseToken4.address

//         const aggregatorContract = await deployments.getArtifact(
//             "AggregatorV3Interface"
//         );
        
//         oracle1 = await deployMockContract(
//             signer1,
//             aggregatorContract.abi
//         );
//         await oracle1.mock.decimals.returns(8);
//         oracle1Addr = oracle1.address

//         oracle2 = await deployMockContract(
//             signer1,
//             aggregatorContract.abi
//         );
//         await oracle2.mock.decimals.returns(8);
//         oracle2Addr = oracle2.address

//         oracle3 = await deployMockContract(
//             signer1,
//             aggregatorContract.abi
//         );
//         await oracle3.mock.decimals.returns(8);
//         oracle3Addr = oracle3.address

//         oracle4 = await deployMockContract(
//             signer1,
//             aggregatorContract.abi
//         );
//         await oracle4.mock.decimals.returns(8);
//         oracle4Addr = oracle4.address
        
//         ico = await deployICO()

//     });

//     afterEach(async () => {
//         await revertProvider(signer1.provider, snapshotId);
//     });


//     const deploybep20Token = async (
//         _signer?: Signer
//     ): Promise<WrappedERC20Token> => {
//         const bep20TokenFactory = new WrappedERC20Token__factory(
//             _signer || signer1
//         );
//         const bep20Token = await bep20TokenFactory.deploy(
//             "Wrapped Token",
//             "WTKN"
//         );
//         return bep20Token;
//     };

//     const deployICO = async (_signer?: Signer): Promise<Contract> => {

//         startDate = Math.round(new Date().getTime() / 1000) + tillStart;

//         let ourTokens = zeroTokenAddrs
//         ourTokens[0] = baseToken1Addr
//         ourTokens[1] = baseToken2Addr
//         ourTokens[2] = baseToken3Addr
//         ourTokens[3] = baseToken4Addr

//         let ourOracles = zeroOracleAddrs
//         ourOracles[0] = oracle1Addr
//         ourOracles[1] = oracle2Addr
//         ourOracles[2] = oracle3Addr
//         ourOracles[3] = oracle4Addr

//         const icoLogicFactory = new ICOLogic__factory(_signer || signer1)

//         const icoLogic = await icoLogicFactory.deploy();

//         const icoProxyFactory = new ICOProxy__factory(_signer || saleOwner)

//         const icoProxy = await icoProxyFactory.deploy(
//           icoLogic.address, 
//           saleOwnerAddr,
//           "0x"
//         );

//         const ico = await icoLogic.attach(
//           icoProxy.address
//         );

//         await ico.initialize(
//             theTokenAddress,
//             fiveThousand,
//             oneUnit,
//             oneHundred,
//             fundWalletAddr,
//             ourTokens,
//             ourOracles,
//         )

//         return ico;
//     }

//     it("initialize contract correctly", async () => {
//         expect(await ico.isLocked()).to.equal(true)
//         expect(await ico.totalSalingAmount()).to.equal(fiveThousand)

//         expect(await ico.minimumAmountToBuy()).to.equal(
//             oneHundred
//         )
//     })

//     it("decimals of the oracles are settled correctly", async () => {
//         expect(
//             await ico.oracleDecimals(baseToken1Addr)
//         ).to.equal(8)

//         expect(
//             await ico.oracleDecimals(baseToken2Addr)
//         ).to.equal(8)

//         expect(
//             await ico.oracleDecimals(baseToken3Addr)
//         ).to.equal(8)

//         expect(
//             await ico.oracleDecimals(baseToken4Addr)
//         ).to.equal(8)

//     })

//     it("check the latest price of a token/coin from oracle", async () => {

//         await oracle1.mock.latestRoundData.returns(
//             "73786976294838208680",
//             BigNumber.from(10).pow(8).mul(450),
//             "1620053717",
//             "1620053717",
//             "73786976294838208680"
//         );


//         expect(
//             await ico.getLatestPrice(oracle1Addr)
//         ).to.equal(BigNumber.from(10).pow(8).mul(450))
//     })

//     it("check the address used as native token", async () => {
//         expect(
//             await ico.asNativeToken()
//         ).to.equal(asNativeAddress)
//     })


//     it("owner of the token sale can charge it", async () => {
//         await theToken.approve(ico.address, fiveThousand)

//         expect(
//             await theToken.allowance(signer1Addr, ico.address)
//         ).to.equal(fiveThousand)

//         await ico.chargeTokenSale(signer1Addr)

//         expect(
//             await ico.isLocked()
//         ).to.equal(false)
//     })



//     it("non owner accounts can not charge the token sale contract", async () => {
//         await theToken.transfer(signer2Addr, fiveThousand)

//         let theTokenSigner2 = theToken.connect(signer2)
//         await theTokenSigner2.approve(ico.address, fiveThousand)

//         expect(
//             await theToken.allowance(signer2Addr, ico.address)
//         ).to.equal(fiveThousand)

//         let icoSigner2 = ico.connect(signer2)

//         await expect(
//           icoSigner2.chargeTokenSale(signer1Addr)
//         ).to.be.revertedWith("Ownable: caller is not the owner")
//     })



//     it("users can buy with a base token from the token sale contract", async () => {

//         await theToken.approve(ico.address, fiveThousand)

//         await ico.chargeTokenSale(signer1Addr)


//         let icoS3 = ico.connect(signer3)

//         expect(
//             await theToken.balanceOf(signer3Addr)
//         ).to.equal(0)


//         await oracle1.mock.latestRoundData.returns(
//             "73786976294838208680",
//             BigNumber.from(10).pow(8).mul(400),
//             "1620053717",
//             "1620053717",
//             "73786976294838208680"
//         );

//         expect(
//             await ico.neededBaseToken(baseToken1Addr, twoHundred)
//         ).to.equal(oneUnit.div(2))


//         let baseToken1Signer3 = baseToken1.connect(signer3)

//         await baseToken1.transfer(signer3Addr, oneUnit)

//         await baseToken1Signer3.approve(ico.address, oneUnit.div(2))

//         await icoS3.buyTokenToSales(baseToken1Addr, signer3Addr, twoHundred)

//         expect(
//             await theToken.balanceOf(signer3Addr)
//         ).to.equal(twoHundred)

//     })

//     it("non owners can not evacuate the vesting contract", async () => {
//         let icoS3 = ico.connect(signer3)

//         await expect(
//           icoS3.evacuateTokenSale(
//                 theTokenAddress,
//                 signer1Addr,
//                 fourHundred
//             )
//         ).to.be.revertedWith("Ownable: caller is not the owner")
//     })

//     it("owner can not evacuate before locking the vesting contract", async () => {

//         await ico.unLockTokenSale()
        
//         await expect(
//           ico.evacuateTokenSale(
//                 theTokenAddress,
//                 signer1Addr,
//                 fourHundred
//             )
//         ).to.be.revertedWith("TokenSale: evacuation only possible when vesting is locked")
//     })


//     it("owner can evacuate the vesting contract", async () => {

//         await theToken.transfer(ico.address, fourHundred)

//         expect(
//             await theToken.balanceOf(signer3Addr)
//         ).to.equal(0)

//         await ico.lockTokenSale()

//         await ico.evacuateTokenSale(
//             theTokenAddress, 
//             signer3Addr,
//             fourHundred
//         )

//         expect(
//             await theToken.balanceOf(signer3Addr)
//         ).to.equal(fourHundred)
//     })
// })

