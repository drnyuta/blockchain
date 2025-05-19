const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const addressPath = path.join(__dirname, "../deployedAddress.json");
  const addresses = JSON.parse(fs.readFileSync(addressPath, "utf8"));
  const deployedAddress = addresses.MultiSigWallet;

  const [owner1, owner2] = await ethers.getSigners();
  const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
  const wallet = MultiSigWallet.attach(deployedAddress);

  // Fund contract with 2 ETH
  const fundTx = await owner1.sendTransaction({
    to: deployedAddress,
    value: ethers.parseEther("2.0"),
  });
  await fundTx.wait();
  console.log("Contract funded with 2 ETH");

  // Check contract balance
  const contractBalance = await ethers.provider.getBalance(deployedAddress);
  console.log("Contract balance:", ethers.formatEther(contractBalance), "ETH");

  // Submit transaction
  console.log("Submitting transaction...");
  const tx = await wallet
    .connect(owner1)
    .submitTransaction(owner2.address, ethers.parseUnits("1", 18), "0x");
  await tx.wait();
  console.log("Transaction submitted.");

  const txIndex = 0;

  // Confirm transaction
  console.log("Confirming transaction by owner1...");
  await wallet.connect(owner1).confirmTransaction(txIndex);
  console.log("Transaction confirmed by owner1.");

  console.log("Confirming transaction by owner2...");
  await wallet.connect(owner2).confirmTransaction(txIndex);
  console.log("Transaction confirmed by owner2.");

  // Execute transaction
  console.log("Executing transaction...");
  const executeTx = await wallet.connect(owner1).executeTransaction(txIndex);
  await executeTx.wait();
  console.log("Transaction executed.");

  // Get transaction info
  const info = await wallet.getTransaction(txIndex);
  console.log("Transaction Info:", {
    to: info.to,
    value: ethers.formatUnits(info.value, 18),
    executed: info.executed,
    confirmations: info.numConfirmations.toString(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
