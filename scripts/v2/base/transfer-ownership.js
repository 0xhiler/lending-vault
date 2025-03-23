const { ethers } = require("hardhat");

const lvFactoryAddr = "0x77Fb0Ff573Da1eC6EC0Cadb31A8Cf69A4BDd9C8D";
const ownerAddr = "0x5ec869c1cb378bb77bc55bb56129399f6828c8c5"

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(owner.address);

  const lvFactoryV2 = await ethers.getContractAt("LendingVaultV2Factory", lvFactoryAddr)
  await lvFactoryV2._setPendingAdmin(ownerAddr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});