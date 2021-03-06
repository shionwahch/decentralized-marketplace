# Design Pattern Decisions

## Assert Guards

All methods involving alteration of state variables have their relative assertion guards. Payable functions (`withdrawFromStorefront`, `withdrawFromAllStorefronts`) have additional assertion guards on the amount to withdraw and the current balance in the contract.

## Circuit Breaker

Curcuit breaker (`Pausable`) is applied on all payable functions. If a vulnerability is found, all payable functions would be suspended upon triggering by the owner of the contract.
