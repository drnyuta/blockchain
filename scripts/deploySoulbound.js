const hre = require("hardhat");

async function main() {
  const name = "ALice Smith Visit Card";
  const baseURI = "ipfs://bafybeihvejmlmew2idw6wce6dpprlo2b6ebrhlyzssdfkxqmuu4o52zs2q/";

  const GameCharacterCollection = await hre.ethers.getContractFactory("SoulboundVisitCard");
  const contract = await GameCharacterCollection.deploy(name, "", baseURI);

  await contract.waitForDeployment();
  console.log("Deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
