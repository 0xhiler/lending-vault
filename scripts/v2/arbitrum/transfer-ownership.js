const { ethers } = require("hardhat");

const lvFactoryAddr = "0x8DC09B07eaBE74f450FEfd57d3708285E3511897";
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