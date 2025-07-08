// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const { ethers } = require('ethers');

const app = express();
const port = process.env.PORT || 3000;

// 🔗 Load environment variables
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// 🔗 Load contract ABI
const { abi } = require("./artifacts/contracts/voting.sol/voting.json");

// 🔗 Initialize provider & signer
const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// 🔗 Smart contract instance
const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

// ✅ Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ API: Serve contract address to frontend
app.get("/config", (req, res) => {
    res.json({
        contractAddress: CONTRACT_ADDRESS,
    });
});

// ✅ POST: Cast a vote
app.post("/vote", async (req, res) => {
    const voteIndex = parseInt(req.body.vote);
    console.log("🗳️ Received vote request for index:", voteIndex);

    try {
        const votingActive = await contractInstance.getVotingStatus();

        if (votingActive) {
            const tx = await contractInstance.vote(voteIndex);
            await tx.wait();
            res.send("✅ Vote cast successfully.");
        } else {
            res.send("⚠️ Voting is finished.");
        }
    } catch (error) {
        console.error("❌ Error casting vote:", error);
        res.status(500).send("❌ Failed to cast vote.");
    }
});

// ✅ POST: Add a new candidate
app.post("/addCandidate", async (req, res) => {
    const { candidateName } = req.body;

    if (!candidateName || candidateName.trim() === "") {
        return res.status(400).send("⚠️ Candidate name is required.");
    }

    try {
        const votingActive = await contractInstance.getVotingStatus();
        if (!votingActive) {
            return res.send("⚠️ Voting has ended. Cannot add new candidates.");
        }

        // 🔍 Check for duplicate names
        const candidates = await contractInstance.getAllVotesOfCandidates();
        const duplicate = candidates.some(c => c.name.toLowerCase() === candidateName.trim().toLowerCase());

        if (duplicate) {
            return res.send("⚠️ Candidate with this name already exists.");
        }

        // ✅ Add if not duplicate
        const tx = await contractInstance.addCandidate(candidateName.trim());
        await tx.wait();

        console.log("✅ Candidate added:", candidateName);
        res.send("✅ Candidate successfully added.");
    } catch (error) {
        console.error("❌ Error adding candidate:", error);
        res.status(500).send("❌ Failed to add candidate.");
    }
});


// ✅ Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
