const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const MyTokenV1 = await ethers.getContractFactory("MyTokenV1");

  const myTokenProxy = await upgrades.deployProxy(
    MyTokenV1,
    [ethers.parseUnits("1000000", 18)],
    {
      initializer: "initialize",
    }
  );

  await myTokenProxy.waitForDeployment();
  console.log("MyToken Proxy deployed to:", await myTokenProxy.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
