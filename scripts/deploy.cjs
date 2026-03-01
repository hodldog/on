const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log('Deploying with account:', deployer.address);
  console.log('Network:', hre.network.name);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(balance), 'ETH');

  const RescueRouter = await hre.ethers.getContractFactory('RescueRouter');
  
  // Operator address (same as deployer by default)
  const operator = process.env.OPERATOR_ADDRESS || deployer.address;
  
  // Rescue destination address
  const rescueDestination = process.env.RESCUE_DESTINATION || deployer.address;
  
  console.log('Operator:', operator);
  console.log('Rescue destination:', rescueDestination);

  const rescueRouter = await RescueRouter.deploy(operator, rescueDestination);
  await rescueRouter.waitForDeployment();

  const address = await rescueRouter.getAddress();
  console.log('RescueRouter deployed to:', address);
  console.log('Transaction hash:', rescueRouter.deploymentTransaction().hash);

  // Verify on explorer if not local network
  if (hre.network.name !== 'hardhat' && process.env.ETHERSCAN_API_KEY) {
    console.log('Waiting for block confirmations...');
    await rescueRouter.deploymentTransaction().wait(5);
    
    try {
      await hre.run('verify:verify', {
        address,
        constructorArguments: [operator, rescueDestination],
      });
      console.log('Contract verified');
    } catch (err) {
      console.error('Verification failed:', err.message);
    }
  }

  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    address,
    operator,
    rescueDestination,
    deploymentTransaction: rescueRouter.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = './deployments';
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('Deployment info saved to:', `${deploymentsDir}/${hre.network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
