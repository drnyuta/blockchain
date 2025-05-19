# Multi-Signature Wallet Smart Contract

## Overview

This project implements a **Multi-Signature Wallet** smart contract in Solidity. It is designed following best practices for secure smart contract development and includes a full testing suite and deployment script.


## How to Deploy and Interact with the Contract

### 1. Start Local Node

Before deploying the contract, you need to run a local Hardhat network:

```bash
npx hardhat node
```

### 2. Deploy the MultiSigWallet Contract
In a separate terminal, deploy the contract to the local network:

```bash
npm run deploy
```

This command runs scripts/deploy.js, which:
-Deploys the MultiSigWallet contract using predefined owners and confirmation requirements.
-Saves the deployed contract address into deployedAddress.json.

The file **deployedAddress.json** changes after every deploy and is used later to reference the deployed contract.

You can modify the owners and confirmation threshold inside **scripts/deploy.js** if needed:

```bash
const wallet = await MultiSigWallet.deploy(
  [owner1.address, owner2.address, owner3.address],
  2
);
```

### 3. Interact with the Contract
Once deployed, you can interact with the contract by running:

```bash
npm run interact
```
This command uses the address from deployedAddress.json and executes:
-A transaction submission
-Confirmations by owners
-Execution of the transaction


## Functional Requirements

### Owners
- The wallet is initialized with a **list of addresses** that act as wallet owners. Now it's set to 3.
- Owners are stored in an array and mapped to a `bool` via `isOwner`.

### Confirmations Required
- A **confirmation threshold** is specified at deployment. Now it's set to 2.
- This is the minimum number of unique owner confirmations required for a transaction to be executed.

### Transaction Lifecycle

1. **Submission**  
   Any owner can propose a transaction by submitting a target address, value in Ether, and optional data payload. This transaction is stored but **not executed** immediately.

2. **Confirmation**  
   Owners can confirm any pending transaction **only once**. Each confirmation increases the `numConfirmations` counter for that transaction.

3. **Execution**  
   Once the number of confirmations reaches the required threshold, **any owner** can execute the transaction. It transfers Ether and optionally calls another contract.

4. **Revocation**  
   Before execution, any confirming owner can **revoke** their confirmation. This decreases the confirmation count and can prevent execution.


## ⚙️ Contract Features

- **Secure Ether handling** using `call{value: ...}()` pattern.
- **Event logging** for all important actions:
  - `Deposit`
  - `SubmitTransaction`
  - `ConfirmTransaction`
  - `RevokeConfirmation`
  - `ExecuteTransaction`
- **Modifiers** ensure only owners can perform restricted actions.
- **Defensive programming** with checks for duplicates, non-existent transactions, already executed actions, etc.
- **Read functions** to inspect the transaction history.


## 🧪 Testing

Tested using **Hardhat** with the following scenarios:

### ✅ Covered Cases:
- Deployment with multiple owners and threshold
- Submission of transaction by owner
- Multiple confirmations by different owners
- Revoke confirmation before execution
- Execution only after reaching threshold
- **Edge cases:**
  - Duplicate confirmations
  - Confirmation or execution by non-owners
  - Execution with insufficient confirmations
  - Revoke without prior confirmation


## 🔒 Security Considerations

| Vulnerability                  | Mitigation                           |
|-------------------------------|--------------------------------------|
| Reentrancy                    | Uses `checks-effects-interactions` pattern |
| Duplicate confirmation        | Checked with `isConfirmed` mapping   |
| Unauthorized access           | Restricted via `onlyOwner` modifier  |
| Invalid transactions          | Handled with `require()` validations |
| Call failure (fallback)       | Requires `success == true` after call |
