const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const contract = await hre.ethers.getContractAt(
    "GameCharacterCollection",
    "0x76feD70A72AF113ac9f9D79B9F239A44b31Fb3bd"
  );

  const student = "0x004B6d313762c2c9B2eF4ED0c459fBdE26630cdF";

  const ids = [0, 1, 2, 3, 4];
  const amounts = [1, 1, 1, 1, 1];

  const mintTx = await contract.mintBatch(deployer.address, ids, amounts, "0x");
  await mintTx.wait();
  console.log("Batch minted tokens:", ids);

  const transferIds = [0, 1]; 
  const transferAmounts = [1, 1];

  const transferTx = await contract.safeBatchTransferFrom(
    deployer.address,
    student,
    transferIds,
    transferAmounts,
    "0x"
  );
  await transferTx.wait();
  console.log(`Transferred tokens ${transferIds.join(", ")} to student: ${student}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
