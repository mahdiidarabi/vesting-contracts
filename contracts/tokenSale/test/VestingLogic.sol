// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Vesting.sol";

contract VestingLogic is Vesting {
    function initialize(
        address _beneficiary,  
        address _vestingToken,  
        uint256 _totalVested,
        uint256 _startingDate,
        uint256 _timeIntervalDuration,
        uint256 _clifNumber,
        uint256 _vestingNumber
    ) public initializer {
        Vesting.__Vesting_init(
            _beneficiary,
            _vestingToken,
            _totalVested,
            _startingDate,
            _timeIntervalDuration,
            _clifNumber,
            _vestingNumber
        );
    }
}