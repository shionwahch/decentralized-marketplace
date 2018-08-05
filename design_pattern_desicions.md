# Design Pattern Decisions

## Assert Guards

All methods involving alteration of state variables have their relative assertion guards. Payable functions (`withdrawFromStorefront`, `withdrawFromAllStorefronts`) have additional assertion guards on the amount to withdraw and the current balance in the contract.

## Circuit Breaker

Curcuit breaker (`Pausable`) is applied on all payable functions.
