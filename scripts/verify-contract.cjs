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
  console.log('Verifying contract at:', deployment.address);
  console.log('Network:', network);

  try {
    await hre.run('verify:verify', {
      address: deployment.address,
      constructorArguments: [deployment.operator, deployment.rescueDestination],
    });
    console.log('✅ Contract verified successfully');
  } catch (err) {
    if (err.message.includes('Already Verified')) {
      console.log('✅ Contract already verified');
    } else {
      console.error('❌ Verification failed:', err.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
