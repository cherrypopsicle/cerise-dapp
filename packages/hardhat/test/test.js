const hardhat = require("hardhat");
const { use } = require("chai");
const should = require("chai").should();
const { solidity } = require("ethereum-waffle");
const { utils } = require("ethers");

use(solidity);
const ethers = hardhat.ethers;
const { parseUnits } = utils;

const sign = (address, data) => {
  return hardhat.network.provider.send("eth_sign", [
    address,
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data)),
  ]);
};

describe("CherryToadz", function () {
  let accounts;
  let myContract;
  before(async function () {
    accounts = await ethers.getSigners(2);
  });

  describe.only("CherryToadz", function () {
    it("Should deploy CherryToadz", async function () {
      const CeriseCryptoadz = await ethers.getContractFactory("CherryToadz");
      myContract = await CeriseCryptoadz.deploy();
    });
    it.skip("Should not allow anyone to mint before public time", async function () {
      // const cerise = ownerz[0];
      const amountToPop = parseUnits("0.08", "ether");
      await myContract
        .popCherry({ value: amountToPop.toHexString() })
        .should.be.revertedWith(`MintTimeNotPublic()`);
    });
    it("allows the owner to mint before the honorary toadz", async function () {
      const amountToPop = parseUnits("0.08", "ether");
      await myContract.popCherry({
        value: amountToPop.toHexString(),
      });
    });

    it("Should allow someone to mint during public time", async function () {
      // const cerise = ownerz[0];\
      const amountToPop = parseUnits("0.08", "ether");
      const timestamp = "1752942620";
      await myContract.setToadzMintTime(timestamp).then(async () => {
        await hardhat.network.provider.send("evm_setNextBlockTimestamp", [
          1852942620,
        ]);
        await myContract
          .popCherry({ value: amountToPop.toHexString() })
          .then(async () => {
            (await myContract.didMint(accounts[0].address)).should.be.equal(
              true
            );
          });
      });
    });
    it("Allows anyone to burn", async function () {
      await myContract.burn("7").then(async () => {
        (await myContract.didBurn(accounts[0].address)).should.be.equal(true);
      });
    });
    it("Allows the owner who burnt the token to have the good shipped", async function () {
      // const hash = ethers.utils.toUtf8Bytes("test");
      const sig = ethers.utils.splitSignature(
        await sign(accounts[0].address, "test")
      );
      const hash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("test"));
      await myContract.canShip("7", hash, sig);
    });
    // it.skip("it allows honorary toadz to mint for a set period of time", async function () {
    //   const amountToPop = parseUnits("0.08", "ether");
    //   const timestamp = "1702942620";
    //   await myContract.setHonoraryMintTime(timestamp).then(async () => {
    //     await hardhat.network.provider.send("evm_setNextBlockTimestamp", [
    //       1712942620,
    //     ]);
    //     await myContract.popCherry({
    //       value: amountToPop.toHexString(),
    //     });
    //   });
    // });
    // old tests may delete
    // it("Should not mint from cerise.eth", async function () {
    //   const cerise = "0xe0110C6EE2138Ecf9962a6f9f6Ad329cDFE1FA17";
    //   const proof = merkleTree.getHexProof(hashOwner(cerise));
    //   await expect(myContract.popCherry(proof)).to.be.revertedWith(
    //     "Invalid merkle proof"
    //   );
    // });
    // it("Should not mint from yazanator address", async function () {
    //   const otherAccount = "0x31ca6ca7f7a3298bc6c5103aa45847f34e382a1c";
    //   const proof = merkleTree.getHexProof(hashOwner(otherAccount));
    //   await expect(myContract.popCherry(proof)).to.be.revertedWith(
    //     "Invalid merkle proof"
    //   );
    // });
  });
  describe("DifferentKindaDigitz", function () {
    it("Should deploy CherryToadz", async function () {
      const DifferentKindaDigitz = await ethers.getContractFactory(
        "DifferentKindaDigitz"
      );
      myContract = await DifferentKindaDigitz.deploy(
        "0xe0110C6EE2138Ecf9962a6f9f6Ad329cDFE1FA17"
      );
    });
    it("only allows Nate Husser to mint", async function () {
      await myContract.dialIn();
    });
  });
});
