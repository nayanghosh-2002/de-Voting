
# 🗳️ Decentralized Voting DApp

A fully functional decentralized voting system built using **Solidity**, **Ethers.js**, and **Node.js**. Users can vote for candidates securely using their **MetaMask wallet**, and the voting data is recorded on the **Ethereum blockchain** (e.g., Sepolia testnet).

## 🌟 Features

- 🔐 Metamask wallet integration (Ethers.js)
- 👤 Add candidates (owner only)
- ✅ One person can vote only once
- ⏳ Voting duration countdown
- 📊 Live results display
- ⚙️ Smart contract deployed on Sepolia
- 🧾 Voter and candidate data stored on-chain

## 📂 Project Structure

```
de-Voting/
├── artifacts/                  
├── contracts/
│   └── voting.sol              
├── public/
│   ├── main.js                 
│   ├── index.html              
│   └── listVoter.html               
├── .env                        
├── server.js                   
├── package.json
└── README.md
```

## 🚀 Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Smart Contract | Solidity          |
| Blockchain     | Ethereum (Sepolia) |
| Web3 Library   | Ethers.js         |
| Backend        | Node.js + Express |
| Frontend       | HTML, CSS, JS     |
| Wallet         | MetaMask          |

## ⚒️ Smart Contract

```solidity
struct Candidate {
    string name;
    uint voteCount;
}
mapping(address => bool) public voters;
Candidate[] public candidates;
```

- `addCandidate(string memory name)` – Add a new candidate
- `vote(uint candidateIndex)` – Vote for a candidate (only once per address)
- `getAllVotesOfCandidates()` – Returns list of candidates and their vote counts
- `getVotingStatus()` – Checks if voting is still active

## 🧪 How to Run Locally

### 1. 📦 Clone the Repo

```bash
git clone https://github.com/nayanghosh-2002/de-Voting
cd de-Voting
```

### 2. 📥 Install Dependencies

```bash
npm install
```

### 3. ⚙️ Configure Environment Variables

Create a `.env` file in the root directory:

```
API_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_deployed_contract_address
```

> 

### 4. 🛠️ Compile and Deploy Smart Contract (Hardhat)

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. ▶️ Start Server

```bash
node server.js
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 MetaMask Setup (Testnet)

1. Install MetaMask
2. Switch to **Sepolia Testnet**
3. Get test ETH from the [Sepolia Faucet](https://sepoliafaucet.com/)
4. Connect wallet to the app

## 📌 Improvements (To-do)

- [ ] Connect wallet-based authentication for voting access
- [ ] Frontend alerts instead of page reloads
- [ ] Admin dashboard for result analysis
- [ ] IPFS integration for image-based candidates

## 🧑‍💻 Author

**Nayan Ghosh**

-  [LinkedIn](https://www.linkedin.com/in/nayanghosh2002/)
-  [Twitter](https://x.com/itsnayangh)

## 📄 License

This project is licensed under the MIT License. Feel free to fork, contribute, and improve it.

## 💬 Support

If this project helped you, leave a ⭐ on the repo or reach out for collaboration. Happy coding!
