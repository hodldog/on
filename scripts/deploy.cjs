const hre = require('hardhat');

const OPERATOR = '0xB0E0306AB4b82774686d7D032e0157dDc8352648';
const RESCUE_DESTINATION = '0xB0E0306AB4b82774686d7D032e0157dDc8352648';

async function main() {
  const networkName = hre.network.name;
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Deploying RescueRouter to ${networkName.toUpperCase()}...`);
  console.log('='.repeat(60));

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${hre.ethers.formatEther(balance)} native tokens`);

  const RescueRouter = await hre.ethers.getContractFactory('RescueRouter');
  
  console.log('\nDeploying RescueRouter...');
  console.log(`Operator: ${OPERATOR}`);
  console.log(`Rescue Destination: ${RESCUE_DESTINATION}`);
  
  const router = await RescueRouter.deploy(OPERATOR, RESCUE_DESTINATION);
  await router.waitForDeployment();

  const address = await router.getAddress();
  console.log(`\n✅ RescueRouter deployed to: ${address}`);
  console.log(`\nTo verify: npx hardhat verify --network ${networkName} ${address} ${OPERATOR} ${RESCUE_DESTINATION}`);
  
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
