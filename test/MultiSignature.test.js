const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSigWallet", function () {
  let wallet, addr1, addr2, addr3, recipient, notOwner;

  beforeEach(async function () {
    [addr1, addr2, addr3, recipient, notOwner] = await ethers.getSigners();

    const owners = [addr1.address, addr2.address, addr3.address];
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    wallet = await MultiSigWallet.deploy(owners, 2);
    await wallet.waitForDeployment();

    // Fund the wallet
    await addr1.sendTransaction({
      to: await wallet.getAddress(),
      value: ethers.parseEther("1.0"),
    });
  });

  describe("Deployment", function () {
    it("should set owners and required confirmations", async function () {
      expect(await wallet.numConfirmationsRequired()).to.equal(2);
      expect(await wallet.isOwner(addr1.address)).to.be.true;
      expect(await wallet.isOwner(addr2.address)).to.be.true;
      expect(await wallet.isOwner(addr3.address)).to.be.true;
      expect(await wallet.isOwner(notOwner.address)).to.be.false;
    });
  });

  describe("Transaction Submission", function () {
    it("should allow an owner to submit a transaction", async function () {
      await expect(
        wallet
          .connect(addr1)
          .submitTransaction(recipient.address, ethers.parseEther("0.5"), "0x")
      ).to.emit(wallet, "SubmitTransaction");

      const tx = await wallet.getTransaction(0);
      expect(tx.to).to.equal(recipient.address);
      expect(tx.executed).to.be.false;
    });

    it("should NOT allow a non-owner to submit a transaction", async function () {
      await expect(
        wallet
          .connect(notOwner)
          .submitTransaction(recipient.address, ethers.parseEther("0.5"), "0x")
      ).to.be.revertedWith("not owner");
    });
  });

  describe("Transaction Confirmation and Revocation", function () {
    beforeEach(async function () {
      await wallet
        .connect(addr1)
        .submitTransaction(recipient.address, ethers.parseEther("0.1"), "0x");
    });

    it("should allow owners to confirm a transaction", async function () {
      await expect(wallet.connect(addr1).confirmTransaction(0)).to.emit(
        wallet,
        "ConfirmTransaction"
      );
      await expect(wallet.connect(addr2).confirmTransaction(0)).to.emit(
        wallet,
        "ConfirmTransaction"
      );

      const tx = await wallet.getTransaction(0);
      expect(tx.numConfirmations).to.equal(2);
    });

    it("should NOT allow duplicate confirmations", async function () {
      await wallet.connect(addr1).confirmTransaction(0);
      await expect(
        wallet.connect(addr1).confirmTransaction(0)
      ).to.be.revertedWith("tx already confirmed");
    });

    it("should allow an owner to revoke their confirmation", async function () {
      await wallet.connect(addr1).confirmTransaction(0);
      await expect(wallet.connect(addr1).revokeConfirmation(0)).to.emit(
        wallet,
        "RevokeConfirmation"
      );

      const tx = await wallet.getTransaction(0);
      expect(tx.numConfirmations).to.equal(0);
    });

    it("should NOT allow revocation if not previously confirmed", async function () {
      await expect(
        wallet.connect(addr2).revokeConfirmation(0)
      ).to.be.revertedWith("tx not confirmed");
    });
  });

  describe("Transaction Execution", function () {
    beforeEach(async function () {
      await wallet
        .connect(addr1)
        .submitTransaction(recipient.address, ethers.parseEther("0.2"), "0x");
      await wallet.connect(addr1).confirmTransaction(0);
      await wallet.connect(addr2).confirmTransaction(0);
    });

    it("should execute a confirmed transaction", async function () {
      const initialBalance = await ethers.provider.getBalance(
        recipient.address
      );

      await expect(wallet.connect(addr1).executeTransaction(0)).to.emit(
        wallet,
        "ExecuteTransaction"
      );

      const tx = await wallet.getTransaction(0);
      expect(tx.executed).to.be.true;

      const finalBalance = await ethers.provider.getBalance(recipient.address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("0.2"));
    });

    it("should NOT execute if not enough confirmations", async function () {
      await wallet
        .connect(addr3)
        .submitTransaction(recipient.address, ethers.parseEther("0.2"), "0x");
      await wallet.connect(addr1).confirmTransaction(1);
      await expect(
        wallet.connect(addr1).executeTransaction(1)
      ).to.be.revertedWith("cannot execute tx");
    });
  });

  describe("Edge Cases", function () {
    it("should NOT allow confirming non-existent transaction", async function () {
      await expect(
        wallet.connect(addr1).confirmTransaction(999)
      ).to.be.revertedWith("tx does not exist");
    });

    it("should NOT allow revoking non-existent transaction", async function () {
      await expect(
        wallet.connect(addr2).revokeConfirmation(999)
      ).to.be.revertedWith("tx does not exist");
    });

    it("should NOT allow executing non-existent transaction", async function () {
      await expect(
        wallet.connect(addr1).executeTransaction(999)
      ).to.be.revertedWith("tx does not exist");
    });

    it("should NOT allow execution twice", async function () {
      await wallet
        .connect(addr1)
        .submitTransaction(recipient.address, ethers.parseEther("0.2"), "0x");
      await wallet.connect(addr1).confirmTransaction(0);
      await wallet.connect(addr2).confirmTransaction(0);
      await wallet.connect(addr1).executeTransaction(0);
      await expect(
        wallet.connect(addr1).executeTransaction(0)
      ).to.be.revertedWith("tx already executed");
    });
  });
});
