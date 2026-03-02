const hre = require('hardhat');

const NETWORKS = ['mainnet', 'bsc', 'polygon', 'arbitrum', 'base'];

const OPERATOR = '0xB0E0306AB4b82774686d7D032e0157dDc8352648';
const RESCUE_DESTINATION = '0xB0E0306AB4b82774686d7D032e0157dDc8352648';

const RPC_URLS = {
  mainnet: 'https://eth.llamarpc.com',
  bsc: 'https://bsc-dataseed.binance.org',
  polygon: 'https://polygon-mainnet.g.alchemy.com/v2/demo',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  base: 'https://mainnet.base.org',
};

const EXPLORER_URLS = {
  mainnet: 'https://etherscan.io',
  bsc: 'https://bscscan.com',
  polygon: 'https://polygonscan.com',
  arbitrum: 'https://arbiscan.io',
  base: 'https://basescan.org',
};

async function deployToNetwork(networkName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Deploying to ${networkName.toUpperCase()}...`);
  console.log('='.repeat(60));

  try {
    await hre.run('compile');

    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deployer: ${deployer.address}`);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);

    const RescueRouter = await hre.ethers.getContractFactory('RescueRouter');
    
    console.log('Deploying RescueRouter...');
    const router = await RescueRouter.deploy(OPERATOR, RESCUE_DESTINATION);
    await router.waitForDeployment();

    const address = await router.getAddress();
    console.log(`\n✅ RescueRouter deployed to: ${address}`);
    console.log(`Explorer: ${EXPLORER_URLS[networkName]}/address/${address}`);

    return { network: networkName, address, success: true };
  } catch (error) {
    console.error(`\n❌ Failed to deploy to ${networkName}: ${error.message}`);
    return { network: networkName, address: null, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n🚀 StealthGuard RescueRouter Multi-Chain Deployment\n');
  console.log(`Operator: ${OPERATOR}`);
  console.log(`Rescue Destination: ${RESCUE_DESTINATION}`);

  const results = [];

  for (const network of NETWORKS) {
    const result = await deployToNetwork(network);
    results.push(result);
    
    if (result.success) {
      console.log(`\n⏳ Waiting 30 seconds before next deployment...`);
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('DEPLOYMENT SUMMARY');
  console.log('='.repeat(60));

  for (const result of results) {
    if (result.success) {
      console.log(`✅ ${result.network.toUpperCase()}: ${result.address}`);
    } else {
      console.log(`❌ ${result.network.toUpperCase()}: FAILED - ${result.error}`);
    }
  }

  console.log('\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
