const hre = require("hardhat");

async function main() {
  const name = "Game Characters";
  const baseURI = "ipfs://bafybeigy22agvlttpfqkjgjuzm37ch3y5smxw5xvxicopxtjzt7trpiphe/"; 

  const GameCharacterCollection = await hre.ethers.getContractFactory("GameCharacterCollection");
  const contract = await GameCharacterCollection.deploy(name, baseURI);

  await contract.waitForDeployment();
  const address = await contract.getAddress()
  console.log("Deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
