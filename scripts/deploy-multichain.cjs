const { execSync } = require('child_process');

const networks = process.env.NETWORKS 
  ? process.env.NETWORKS.split(',') 
  : ['bsc', 'polygon', 'arbitrum', 'base', 'mainnet'];

async function main() {
  console.log('Multi-chain deployment');
  console.log('Networks:', networks.join(', '));
  console.log('');

  for (const network of networks) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Deploying to: ${network.toUpperCase()}`);
    console.log('='.repeat(60));

    try {
      execSync(`npx hardhat run scripts/deploy.cjs --network ${network}`, {
        stdio: 'inherit',
      });
      console.log(`✅ ${network} deployed successfully`);
    } catch (err) {
      console.error(`❌ ${network} deployment failed:`, err.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Multi-chain deployment complete');
  console.log('='.repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
