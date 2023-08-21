// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract Vesting is OwnableUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable {
    using SafeMath for uint256;

    bool public isAnEmergency;

    address public beneficiary;

    IERC20 public vestingToken;
    uint256 public totalVested;
    uint256 public totalReleased;

    // the following address will be used instead of the native token of the network
    address constant public asNativeToken = 0x1111111111111111111010101010101010101010;

    uint256 public startingDate;
    uint256 public timeIntervalDuration;
    uint256 public clifNumber;
    uint256 public vestingNumber;

    event ReleaseVesting(address indexed beneficiary, uint256 amount);

    function __Vesting_init(
        address _beneficiary,  
        address _vestingToken,  
        uint256 _totalVested,
        uint256 _startingDate,
        uint256 _timeIntervalDuration,
        uint256 _clifNumber,
        uint256 _vestingNumber
    ) internal onlyInitializing {
        
        OwnableUpgradeable.__Ownable_init();
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        PausableUpgradeable.__Pausable_init();

        require(
            _beneficiary != address(0),
            "Vesting: user is zero"
        );

        require(
            _vestingToken != address(0),
            "Vesting: token is zero"
        );

        require(
            _totalVested > 0,
            "Vesting: total vested is 0"
        );

        require(
            _timeIntervalDuration > 0,
            "Vesting: time intervals is 0"
        );

        require(
            _vestingNumber > 0,
            "Vesting: vesting number is 0"
        );

        beneficiary = _beneficiary;

        vestingToken = IERC20(_vestingToken);

        totalVested = _totalVested;
        startingDate = _startingDate;
        timeIntervalDuration = _timeIntervalDuration;
        clifNumber = _clifNumber;
        vestingNumber = _vestingNumber;
        
    }

    function _release() internal returns (uint256) {
        require(
            !isAnEmergency,
            "Vesting: is in emergency"
        );
        
        require(
            _msgSender() == beneficiary, 
            "Vesting: only beneficiary of vesting can get tokens"
        );

        uint256 vestedForNow = calculateVesting(block.timestamp); 

        require(
            vestedForNow >= 0, 
            "Vesting: no vested token (not started or finished)"
        );

        totalReleased = totalReleased + vestedForNow;

        emit ReleaseVesting(_msgSender(), vestedForNow);

        return vestedForNow;
    }


    function calculateVesting(uint256 timestamp) public view returns (uint256) {
        if (timestamp < (startingDate + ( clifNumber * timeIntervalDuration ))) {
            return 0;
        } else if (timestamp >= (startingDate + ( (clifNumber + vestingNumber) * timeIntervalDuration )) ) {
            return totalVested - totalReleased;
        } else {
            uint256 remainedVesting = ((timestamp - startingDate) / timeIntervalDuration) + 1;
            remainedVesting = remainedVesting - clifNumber;
            remainedVesting = (remainedVesting * totalVested) / vestingNumber; 
            return remainedVesting - totalReleased;
        }
    }


    function declareEmergency()
        external
        onlyOwner
    {
        isAnEmergency = true;
    }


    /**
     * @dev the owner of the vesting can un-lock the vesting 
     */
    function evacuateVesting(address stuckToken, address payable reciever, uint256 amount) external onlyOwner {
        require(
            isAnEmergency,
            "Vesting: evacuation only possible when vesting is in emergency"
        );

        if (stuckToken == asNativeToken) {

            reciever.transfer(amount);

            // require(
            //     reciever.transfer(amount),
            //     "VestingWallet: couldn't transfer native token"
            // );
        } else {

            IERC20 theToken = IERC20(stuckToken);
            require(
                theToken.transfer(reciever, amount),
                "Vesting: couldn't transfer token"
            );
        }        
    }
}