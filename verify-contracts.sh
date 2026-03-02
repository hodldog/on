#!/bin/bash

# RescueRouter Contract Verification Script
# Contracts are already verified on Sourcify
# Use this script for Etherscan verification if needed

# Constructor arguments:
# operator: 0xB0E0306AB4b82774686d7D032e0157dDc8352648
# rescueDestination: 0xB0E0306AB4b82774686d7D032e0157dDc8352648

# Contract Addresses (Deployed 2026-03-02)
ETHEREUM="0xFb2e8Bc906A0b710fA0aa3f5D5CCEAa0CC77A17e"
BSC="0xd2Eb25A83e5709Fc668025Cf45032A2B4E216654"
POLYGON="0x91c5E42e7822803173E1a6bdd21396B024490968"
ARBITRUM="0x06c178af8904CD3e7A010dC4CCc9272d68a3c0d9"
BASE="0x54535eDABE6aceeE38Aede2933aD3464F014106e"

OPERATOR="0xB0E0306AB4b82774686d7D032e0157dDc8352648"
RESCUE_DEST="0xB0E0306AB4b82774686d7D032e0157dDc8352648"

# Load API keys from .env
source /home/ubuntu/StealthGuard/backend/.env 2>/dev/null || true

echo "=== RescueRouter Verification ==="
echo ""
echo "Contracts are already verified on Sourcify:"
echo "  - Ethereum: https://repo.sourcify.dev/contracts/full_match/1/$ETHEREUM/"
echo "  - BSC: https://repo.sourcify.dev/contracts/full_match/56/$BSC/"
echo "  - Polygon: https://repo.sourcify.dev/contracts/full_match/137/$POLYGON/"
echo "  - Arbitrum: https://repo.sourcify.dev/contracts/full_match/42161/$ARBITRUM/"
echo "  - Base: https://repo.sourcify.dev/contracts/full_match/8453/$BASE/"
echo ""

# Check for API keys
if [ -z "$BSCSCAN_API_KEY" ] && [ -z "$ETHERSCAN_API_KEY" ]; then
    echo "For Etherscan verification, get API keys from:"
    echo "  - https://etherscan.io/myapikey"
    echo "  - https://bscscan.com/myapikey"
    echo "  - https://polygonscan.com/myapikey"
    echo "  - https://arbiscan.io/myapikey"
    echo "  - https://basescan.org/myapikey"
    exit 0
fi

# Ethereum
if [ -n "$ETHERSCAN_API_KEY" ]; then
    echo "Verifying on Etherscan..."
    export ETHERSCAN_API_KEY
    npx hardhat verify --network mainnet $ETHEREUM $OPERATOR $RESCUE_DEST
fi

# BSC
if [ -n "$BSCSCAN_API_KEY" ]; then
    echo "Verifying on BSCScan..."
    export BSCSCAN_API_KEY
    npx hardhat verify --network bsc $BSC $OPERATOR $RESCUE_DEST
fi

# Polygon
if [ -n "$POLYGONSCAN_API_KEY" ]; then
    echo "Verifying on PolygonScan..."
    export POLYGONSCAN_API_KEY
    npx hardhat verify --network polygon $POLYGON $OPERATOR $RESCUE_DEST
fi

# Arbitrum
if [ -n "$ARBISCAN_API_KEY" ]; then
    echo "Verifying on Arbiscan..."
    export ARBISCAN_API_KEY
    npx hardhat verify --network arbitrum $ARBITRUM $OPERATOR $RESCUE_DEST
fi

# Base
if [ -n "$BASESCAN_API_KEY" ]; then
    echo "Verifying on Basescan..."
    export BASESCAN_API_KEY
    npx hardhat verify --network base $BASE $OPERATOR $RESCUE_DEST
fi

echo ""
echo "=== Verification Complete ==="
