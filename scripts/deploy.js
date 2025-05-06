const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Correct balance check for ethers v6
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} ETH`);

  const NGORegistry = await hre.ethers.getContractFactory("NGORegistry");
  const ngoRegistry = await NGORegistry.deploy();

  await ngoRegistry.waitForDeployment();

  const contractAddress = await ngoRegistry.getAddress();
  console.log("NGORegistry deployed to:", contractAddress);

  console.log(`Run this command to verify: 
  npx hardhat verify --network sepolia ${contractAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
