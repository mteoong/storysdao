import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying StorydaoToken with account:", deployer.address);

  const StorydaoToken = await ethers.getContractFactory("StorydaoToken");
  const token = await StorydaoToken.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("StorydaoToken deployed to:", address);
  console.log(
    "Add this to your .env.local: NEXT_PUBLIC_TOKEN_ADDRESS=" + address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
