const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt(
    "SoulboundVisitCard",
    "0x2e3f0e138A12EA7a22C93674a363A8d326fCf592"
  );

  const studentAddress = "0x8A6b907C5F257E4a509236db9e703CcC3C6a77c5";

  const tx = await contract.mint(
    studentAddress,
    "Alice Smith",
    "ID12345",
    "Blockchain 101",
    2025
  );

  await tx.wait();
  console.log("Minted Soulbound Visit Card to:", studentAddress);
  console.log("Transaction Hash:", tx.hash);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
