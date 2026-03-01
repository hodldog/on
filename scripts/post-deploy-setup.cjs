const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const network = hre.network.name;
  const deploymentFile = `./deployments/${network}.json`;

  if (!fs.existsSync(deploymentFile)) {
    console.error(`Deployment file not found: ${deploymentFile}`);
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
  console.log('Setting up contract at:', deployment.address);

  const [signer] = await hre.ethers.getSigners();
  
  const RescueRouter = await hre.ethers.getContractFactory('RescueRouter');
  const rescueRouter = RescueRouter.attach(deployment.address);

  // Enable test mode if requested
  if (process.env.ENABLE_TEST_MODE === 'true') {
    console.log('Enabling test mode...');
    const tx = await rescueRouter.enableTestMode(true);
    await tx.wait();
    console.log('✅ Test mode enabled');
  }

  // Set operator if different from deployer
  if (process.env.OPERATOR_ADDRESS) {
    const currentOperator = await rescueRouter.operator();
    if (currentOperator.toLowerCase() !== process.env.OPERATOR_ADDRESS.toLowerCase()) {
      console.log('Setting operator to:', process.env.OPERATOR_ADDRESS);
      const tx = await rescueRouter.setOperator(process.env.OPERATOR_ADDRESS);
      await tx.wait();
      console.log('✅ Operator updated');
    }
  }

  // Update rescue destination if needed
  if (process.env.RESCUE_DESTINATION) {
    const currentDest = await rescueRouter.rescueDestination();
    if (currentDest.toLowerCase() !== process.env.RESCUE_DESTINATION.toLowerCase()) {
      console.log('Updating rescue destination to:', process.env.RESCUE_DESTINATION);
      const tx = await rescueRouter.setRescueDestination(process.env.RESCUE_DESTINATION);
      await tx.wait();
      console.log('✅ Rescue destination updated');
    }
  }

  console.log('Setup complete');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
