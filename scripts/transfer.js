const { ethers } = require("hardhat");

async function main() {
  const proxyAddress = "0x1193d2e1620Cc257FC7021006BaC3413b27b9361";

  const sender = await ethers.getSigner("0x004B6d313762c2c9B2eF4ED0c459fBdE26630cdF"); // Указываешь адрес отправителя
  const receiver = await ethers.getSigner("0x8A6b907C5F257E4a509236db9e703CcC3C6a77c5"); // Указываешь адрес получателя

  console.log("Sender address:", sender.address);
  console.log("Receiver address:", receiver.address);

  const MyToken = await ethers.getContractAt("MyTokenV1", proxyAddress);

  const amount = ethers.parseUnits("100", 18);

  console.log(
    `Transferring ${ethers.formatUnits(amount, 18)} MTK to ${
      receiver.address
    }...`
  );

  const tx = await MyToken.connect(sender).transfer(receiver.address, amount);
  await tx.wait();

  console.log("Transfer complete!");

  const senderBalance = await MyToken.balanceOf(sender.address);
  const receiverBalance = await MyToken.balanceOf(receiver.address);

  console.log(`Sender balance: ${ethers.formatUnits(senderBalance, 18)} MTK`);
  console.log(
    `Receiver balance: ${ethers.formatUnits(receiverBalance, 18)} MTK`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
