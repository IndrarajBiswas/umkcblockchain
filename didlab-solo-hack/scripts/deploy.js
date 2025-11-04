const hre = require("hardhat");

async function main(){
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const Badge = await hre.ethers.getContractFactory("DidLabBadge");
  const badge = await Badge.deploy();
  await badge.deployed();

  console.log("DidLabBadge:", badge.address);
}

main().catch((e)=>{console.error(e); process.exit(1);});
