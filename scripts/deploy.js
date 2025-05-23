const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  const [owner1, owner2] = await ethers.getSigners();

  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const wallet = await MultiSigWallet.deploy(
    [owner1.address, owner2.address],
    2 
  );
  await wallet.waitForDeployment();

  const deployedAddress = await wallet.getAddress();
  console.log("Deployed to:", deployedAddress);

  const addressesPath = path.join(__dirname, "../deployedAddress.json");
  fs.writeFileSync(
    addressesPath,
    JSON.stringify({ MultiSigWallet: deployedAddress }, null, 2)
  );
  console.log("Address saved to deployedAddress.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
