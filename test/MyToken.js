const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("MyToken Proxy Contract", function () {
  let owner, user;
  let tokenV1, tokenProxy;

  beforeEach(async function () {
    // Получаем аккаунты для тестов
    [owner, user] = await ethers.getSigners();

    // Деплоим первоначальную версию контракта
    const MyTokenV1 = await ethers.getContractFactory("MyTokenV1");

    // Деплоим прокси
    tokenProxy = await upgrades.deployProxy(
      MyTokenV1,
      [ethers.parseUnits("1000000", 18)], // Начальная поставка токенов
      { initializer: "initialize" }
    );

    // Получаем контракт через прокси
    tokenV1 = await ethers.getContractAt("MyTokenV1", tokenProxy.address);
  });

  it("should deploy the proxy and check initial balance", async function () {
    const balance = await tokenV1.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseUnits("1000000", 18));
  });

  it("should allow minting new tokens", async function () {
    // Мантим токены для пользователя
    await tokenV1.mint(user.address, ethers.parseUnits("500", 18));

    const userBalance = await tokenV1.balanceOf(user.address);
    expect(userBalance).to.equal(ethers.parseUnits("500", 18));
  });

  it("should allow transferring tokens", async function () {
    await tokenV1.transfer(user.address, ethers.parseUnits("100", 18));

    const ownerBalance = await tokenV1.balanceOf(owner.address);
    const userBalance = await tokenV1.balanceOf(user.address);

    expect(ownerBalance).to.equal(ethers.parseUnits("999900", 18));
    expect(userBalance).to.equal(ethers.parseUnits("100", 18));
  });

  it("should upgrade to MyTokenV2 and retain balances", async function () {
    // Создаем новый контракт версии 2
    const MyTokenV2 = await ethers.getContractFactory("MyTokenV2");

    // Апгрейдим прокси на новый контракт
    await upgrades.upgradeProxy(tokenProxy.address, MyTokenV2);

    // Проверяем, что баланс не изменился
    const ownerBalance = await tokenV1.balanceOf(owner.address);
    const userBalance = await tokenV1.balanceOf(user.address);

    expect(ownerBalance).to.equal(ethers.parseUnits("999900", 18));
    expect(userBalance).to.equal(ethers.parseUnits("100", 18));

    const version = await tokenV1.version();
    expect(version).to.equal("V2");
  });
});
