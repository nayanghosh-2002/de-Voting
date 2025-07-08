require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const balance = await provider.getBalance(wallet.address);

  console.log("🧾 Wallet Address:", wallet.address);
  console.log("💰 Wallet Balance:", ethers.utils.formatEther(balance), "SepoliaETH");
}

main().catch((err) => {
  console.error("❌ Error:", err);
});
