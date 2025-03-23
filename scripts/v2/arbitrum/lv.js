const { ethers } = require("hardhat");

const reserveAdmin = "0x9fd93712400902bff6040efa72B28Bf80152F056"

const underlyings = [
  {
    ind: 0,
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // ETH
    symbol: "ibexETH",
    name: "Impermax Lent ETHV2",
    borrowables: [
      "0x608B8DA26CF1DD94aE62bfe3798f808d65a51600",
      "0x4E7c57461a23a973C5487F0658C660aa52Dd196D",
    ]
  },
  {
    ind: 1,
    address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", // USDC.e
    symbol: "ibexUSDC.e",
    name: "Impermax Lent USDC.e",
    borrowables: [
      "0x086f1f8799268d0308B81305EA9D5f5e622aAA4d",
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
    const lvFactoryV2 = await ethers.getContractAt("LendingVaultV2Factory", "0x8DC09B07eaBE74f450FEfd57d3708285E3511897")
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

// LVDeployer deployed to: 0xa262287CC16Ed37CDfA8B32150f9CbA9BcAad0B1
// LVFactory deployed to: 0x8DC09B07eaBE74f450FEfd57d3708285E3511897

// IBEXETH: 0x90e3329B8E372bD7C6823b8866C7804DC5282Aab
// IBEXUSDC.e: 0x069C1372b1Ebf3c9aBc3d37e673584962C52a0Ac