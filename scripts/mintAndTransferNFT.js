const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt(
    "GameCharacterCollection",
    "0x76feD70A72AF113ac9f9D79B9F239A44b31Fb3bd"
  );

  const student = "0x8A6b907C5F257E4a509236db9e703CcC3C6a77c5";

  for (let i = 1; i < 10; i++) {
    const tx = await contract.mint(deployer.address, i, 2, "0x");
    await tx.wait();
    console.log(`Minted token ID ${i} to deployer`);
  }

  // Transfer token ID 1 and 2 to student (1 of each)
  const tx1 = await contract.safeTransferFrom(
    deployer.address,
    student,
    1,
    1,
    "0x"
  );
  await tx1.wait();
  const tx2 = await contract.safeTransferFrom(
    deployer.address,
    student,
    2,
    1,
    "0x"
  );
  await tx2.wait();

  console.log(`Transferred token IDs 1 & 2 to student: ${student}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
