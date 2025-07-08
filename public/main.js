let WALLET_CONNECTED = "";
let contractAddress = "";
let contractAbi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotesOfCandidates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainingTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];



async function loadContractAddress() {
  try {
    const res = await fetch("/config");
    const data = await res.json();
    contractAddress = data.contractAddress;
    console.log("✅ Contract Address loaded:", contractAddress);
  } catch (err) {
    console.error("❌ Failed to load contract address from server", err);
  }
}

// Call it at the top of your main.js
loadContractAddress();



const checkIfVotedAndUpdateUI = async () => {
    if (!WALLET_CONNECTED) return;

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const hasVoted = await contract.voters(WALLET_CONNECTED);

        const voteDropdown = document.getElementById("vote");
        const voteBtn = document.getElementById("votebtn"); // Make sure your button has this ID
        const cand = document.getElementById("cand");

        if (hasVoted) {
            voteDropdown.disabled = true;
            voteBtn.disabled = true;
            cand.innerHTML = "🛑 You have already voted!";
        } else {
            voteDropdown.disabled = false;
            voteBtn.disabled = false;
            cand.innerHTML = "✅ You are eligible to vote.";
        }
    } catch (err) {
        console.error("❌ Error checking if already voted:", err);
    }
};




const loadCandidates = async () => {
    const dropdown = document.getElementById("vote");

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const candidates = await contract.getAllVotesOfCandidates();

        dropdown.innerHTML = `<option value="">-- Select a Candidate --</option>`;

        candidates.forEach((candidate, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = candidate.name;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("❌ Failed to load candidates:", error);
    }
};


window.onload = () => {
    loadCandidates();
};



const connectMetamask = async () => {
    if (typeof window.ethereum !== "undefined" && typeof ethers !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            WALLET_CONNECTED = await signer.getAddress();

            const element = document.getElementById("metamasknotification");
            element.innerHTML = "✅ Metamask is connected: " + WALLET_CONNECTED;

            await checkIfVotedAndUpdateUI();  // 🔁 Call this here
        } catch (err) {
            console.error("❌ Metamask connection error:", err);
            alert("Metamask connection failed. Check console for details.");
        }
    } else {
        alert("❌ Ethers.js or Metamask not detected.");
    }
};

const addVote = async () => {
    const voteDropdown = document.getElementById("vote");
    const selectedIndex = voteDropdown.value;
    const cand = document.getElementById("cand");

    if (!WALLET_CONNECTED) {
        cand.innerHTML = "❗ Please connect Metamask first.";
        return;
    }

    if (selectedIndex === "") {
        cand.innerHTML = "❗ Please select a candidate.";
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        cand.innerHTML = "🕐 Submitting vote...";
        const tx = await contract.vote(parseInt(selectedIndex));
        await tx.wait();

        cand.innerHTML = "✅ Vote cast successfully!";
    } catch (err) {
        console.error("❌ Voting failed:", err);
        cand.innerHTML = "❌ Failed to cast vote. Check console.";
    }
};


const voteStatus = async () => {
    const statusElement = document.getElementById("status");
    const timeElement = document.getElementById("time");

    if (!WALLET_CONNECTED) {
        statusElement.innerHTML = "❗ Please connect Metamask first.";
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const status = await contract.getVotingStatus();
        const time = await contract.getRemainingTime();

        statusElement.innerHTML = status ? "🟢 Voting is currently open" : "🔴 Voting has ended";
        timeElement.innerHTML = `⏳ Remaining time: ${time.toString()} seconds`;
    } catch (err) {
        console.error("❌ Error fetching voting status:", err);
        statusElement.innerHTML = "❌ Could not fetch status.";
    }
};

const getAllCandidates = async () => {
    const p3 = document.getElementById("p3");
    const table = document.getElementById("myTable");

    if (!WALLET_CONNECTED) {
        p3.innerHTML = "❗ Please connect Metamask first.";
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        p3.innerHTML = "🕐 Fetching candidates...";
        const candidates = await contract.getAllVotesOfCandidates();  // ✅ fixed spelling

        table.innerHTML = `
            <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Votes</th>
            </tr>
        `;

        candidates.forEach((cand, i) => {
            const row = table.insertRow();
            row.insertCell(0).innerText = i;
            row.insertCell(1).innerText = cand.name;
            row.insertCell(2).innerText = cand.voteCount.toString();
        });

        p3.innerHTML = "✅ Candidates loaded.";
    } catch (err) {
        console.error("❌ Error fetching candidates:", err);
        p3.innerHTML = "❌ Failed to load candidates.";
    }
};


document.getElementById("addCandidateForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload

    const form = e.target;
    const candidateName = form.candidateName.value;
    const messageEl = document.getElementById("addCandidateMessage");

    if (!candidateName.trim()) {
        messageEl.textContent = "⚠️ Please enter a candidate name.";
        return;
    }

    try {
        const response = await fetch("/addCandidate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ candidateName }),
        });

        const text = await response.text();
        messageEl.textContent = text;
    } catch (err) {
        console.error("❌ Error adding candidate:", err);
        messageEl.textContent = "❌ Failed to add candidate.";
    }

    form.reset(); // optional: clear form after submit
});
