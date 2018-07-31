# Avoiding Common Attacks

## Reentrancy

All payable functions (`withdrawFromStorefront`, `withdrawFromAllStorefronts`) have their relative wallets set to 0 before initiating a transfer of value. Also, `call.value()` is avoided in favour of `transfer()`. 

## Transaction-Ordering Dependence (TOD) / Front Running

TODO

## Timestamp Dependence

The application has no logic that is dependent of the block timestamp.

## Integer Overflow and Underflow

Payable functions (`withdrawFromStorefront`, `withdrawFromAllStorefronts`, `purchaseProduct`) have integer overflow checks implemented.

## DoS with (Unexpected) Revert

Payable functions (`withdrawFromStorefront`, `withdrawFromAllStorefronts`, `purchaseProduct`) are implemented separately in favour of pull over push.

## DoS with Block Gas Limit

TODO

## Forcibly Sending Ether to a Contract

TODO