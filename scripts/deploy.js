const hre = require("hardhat");

async function main() {
  console.log("🟡 Starting contract deployment...");

  const [deployer] = await hre.ethers.getSigners();
  const balance = await deployer.getBalance();

  console.log("🧾 Deployer Address:", deployer.address);
  console.log("💰 Deployer Balance:", hre.ethers.utils.formatEther(balance), "SepoliaETH");

  const Voting = await hre.ethers.getContractFactory("Voting");
  console.log("📦 Contract compiled successfully");

  const voting = await Voting.deploy(
    ["Nayan", "Tanya", "Moulina", "Nilanjan"], // 👈 Candidate names
    10 // 👈 Duration in minutes
  );

  await voting.deployed(); // ✅ Correct way to wait for deployment

  console.log("✅ Contract deployed at address:", voting.address);
}

main()
  .then(() => {
    console.log("🎉 Deployment finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });
