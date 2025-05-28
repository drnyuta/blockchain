# Soulbound Visit Card & Game Character NFTs (ERC-721 & ERC-1155)

This project includes two smart contracts:

1. **SoulboundVisitCard (ERC-721)**: A non-transferable "visit card" NFT bound to a student's wallet.
2. **GameCharacterCollection (ERC-1155)**: A set of game character NFTs supporting batch minting and transfers.

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/)
- [Metamask](https://metamask.io/)
- IPFS (e.g., using [web3.storage](https://web3.storage/))

Install dependencies:

```bash
npm install
```

## Contract Deployment

1. Compile Contracts

```bash
npx hardhat compile
```

2. Deploy SoulboundVisitCard

```bash
npx hardhat run scripts/deploySoulbound.js --network sepolia
```

3. Deploy GameCharacterCollection

```bash
npx hardhat run scripts/deployGameCharacter.js --network sepolia
```

## Minting Instructions

1. Mint Soulbound Visit Card (ERC-721)
   Script: scripts/mintSoulbound.js

```bash
await contract.mint(
  studentAddress,
  "Alice Smith",
  "ID12345",
  "Blockchain 101",
  2025
);
```

Run:

```bash
npx hardhat run scripts/mintSoulbound.js --network sepolia
```

2. Batch Mint & Transfer Game Character NFTs (ERC-1155)

Script: scripts/batchMintAndTransfer.js

Run:

```bash
npx hardhat run scripts/batchMintAndTransfer.js --network sepolia
```

## Metadata Structure & Storage (IPFS)

Stored on storacha.

Example of an image: https://bafybeif3jg4l5o7iri6yafuzhn6jo7zzpxlyvejlueqj43xxw3sxvvdo4a.ipfs.w3s.link/parrot.svg

Example of jsons: https://bafybeigy22agvlttpfqkjgjuzm37ch3y5smxw5xvxicopxtjzt7trpiphe.ipfs.w3s.link/

## Viewing NFTs in MetaMask

1. Open MetaMask → NFTs → "Import NFTs"

2. Paste contract address

3. Enter the token ID

4. Note: You may not see images unless MetaMask supports IPFS or metadata is hosted via a gateway

For IPFS URLs, test image visibility using links above.
