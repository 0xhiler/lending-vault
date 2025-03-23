const { ethers } = require("hardhat");

const reserveAdmin = "0x9fd93712400902bff6040efa72B28Bf80152F056"

const underlyings = [
  {
    ind: 0,
    address: "0x4200000000000000000000000000000000000006", // WETH
    symbol: "ibexETH",
    name: "Impermax Lent ETH",
    borrowables: [
      "0x7fbb6111eAC6e4CB5F5cFfbaa39903Ff4340FF59", // usdc/eth
      "0x1Cc240ED506BB7Ee062B4916873e934eA1dd2194", // eth/cbbtc
      "0x36e474b287532c92c4509efe44d19bb69fa6b423", // eth/usdc univ2
    ]
  },
  {
    ind: 1,
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
    symbol: "ibexUSDC",
    name: "Impermax Lent USDC",
    borrowables: [
      "0x8D376D16c70Ec456Cb8bE03c12Ce65A9A0584FfD", // usdc/weth
      "0x4ddA3Ae5576B7D5B42626D671d1Ae738716bc459", // usdc/aero
      "0xCe34f45B98731E5DAE4E0BAAE37eBa63Ba07d684", // usdc/cbbtc
      "0x43EF63ae565fCFbbc277A4C634321c634820ad79", // eth/usdc univ2
    ]
  },
  {
    ind: 2,
    address: "0x4200000000000000000000000000000000000006", // ETH - medium risk
    symbol: "ibexETHV2",
    name: "Impermax Lent ETH V2",
    borrowables: [
      "0x90f5c47cfb7dE8E657eBB174D90E3A4d8D64cDD0", // virtual/eth
    ]
  },
  {
    ind: 3,
    address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf", // cbBTC
    symbol: "ibexcbBTC",
    name: "Impermax Lent cbBTC",
    borrowables: [
      "0xf2b5ebDd02861392C4Aa90838eF4d549362754A4", // eth/cbbtc
      "0xE196398b56175247328C2bF4a9C85497fb02914e", // usdc/cbbtc
    ]
  },
]

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(owner.address);

  // // deploy contracts
  // {
  //   // deploy LVDeployer
  //   const LVDeployerV2 = await ethers.getContractFactory("LVDeployerV2");
  //   const lvDeployer = await LVDeployerV2.deploy();
  //   await lvDeployer.waitForDeployment();
  //   const lvDeployerAddr = await lvDeployer.getAddress();
  //   console.log(`LVDeployer deployed to: ${lvDeployerAddr}`)

  //   // deploy LVFactory
  //   const LVFactoryV2 = await ethers.getContractFactory("LendingVaultV2Factory");
  //   const lvFactoryV2 = await LVFactoryV2.deploy(owner.address, reserveAdmin, lvDeployerAddr);
  //   await lvFactoryV2.waitForDeployment();
  //   const lvFactoryAddr = await lvFactoryV2.getAddress();
  //   console.log(`LVFactory deployed to: ${lvFactoryAddr}`)
  // }

  // init lending vaults
  {
    let tx;
    const lvFactoryV2 = await ethers.getContractAt("LendingVaultV2Factory", "0x77Fb0Ff573Da1eC6EC0Cadb31A8Cf69A4BDd9C8D")
    for (const underlying of underlyings) {
      tx = await lvFactoryV2.createVault(underlying.address, underlying.name, underlying.symbol);
      await tx.wait();

      const vaultAddr = await lvFactoryV2.allVaults(underlying.ind);
      const vaultContract = await ethers.getContractAt("LendingVaultV2", vaultAddr);

      console.log("vault, underlying", vaultAddr, await vaultContract.underlying());

      for (const borrowable of underlying.borrowables) {
        tx = await vaultContract.addBorrowable(borrowable);
        await tx.wait();
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// LVWater deployed to: 0x1c79103cEc595b8af673Cd41271861FFA3B2BEDA
// LVDeployer deployed to: 0x58588680d23c04C47c3F398c1BfAc247021C4288
// LVFactory deployed to: 0x77Fb0Ff573Da1eC6EC0Cadb31A8Cf69A4BDd9C8D

// ibexETH: 0x5F3810Aa219EadAd29329110777b4671ED0b1A78
// ibexUSDC: 0x7838a0329CFF90434424952411D5fFE687360F49
// ibexcbBTC: 0xaD9cfEBB7666f2698cA9d836eD8CBeb0545a4263
// ibexETHV2: 0xa1D0f86d74BB7C832308c640b504b8525168Ed62