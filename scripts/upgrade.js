const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account:", deployer.address);

  const proxyAddress = "0x1193d2e1620Cc257FC7021006BaC3413b27b9361";

  const MyTokenV1 = await ethers.getContractFactory("MyTokenV1");

  const ownerBalanceBefore = await MyTokenV1.attach(proxyAddress).balanceOf(deployer.address);
  console.log("Owner balance BEFORE upgrade:", ethers.formatUnits(ownerBalanceBefore, 18));

  const MyTokenV2 = await ethers.getContractFactory("MyTokenV2");

  console.log("Upgrading Proxy to new MyToken contract...");
  const upgradedProxy = await upgrades.upgradeProxy(proxyAddress, MyTokenV2);

  console.log("Proxy was successfully upgraded:", await upgradedProxy.getAddress());

  const version = await upgradedProxy.version();
  console.log("Version from upgraded contract:", version);

  const ownerBalanceAfter = await upgradedProxy.balanceOf(deployer.address);
  console.log("Owner balance AFTER upgrade:", ethers.formatUnits(ownerBalanceAfter, 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
