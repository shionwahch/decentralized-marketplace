# Avoiding Common Attacks

## Reentrancy

All payable functions (`withdrawFromStorefront`, `withdrawFromAllStorefronts`) have their relative wallets set to 0 before initiating a transfer of value. Also, `call.value()` is avoided in favour of `transfer()`. 

## Timestamp Dependence

The application has no logic that is dependent of the block timestamp.

## Integer Overflow and Underflow

Payable functions (`withdrawFromStorefront`, `withdrawFromAllStorefronts`, `purchaseProduct`) have integer overflow checks implemented. All mathematical operations have been replaced with methods from SafeMath.

## DoS with (Unexpected) Revert

Payable functions (`withdrawFromStorefront`, `withdrawFromAllStorefronts`, `purchaseProduct`) are implemented separately in favour of pull over push.

## Forcibly Sending Ether to a Contract

Check is added to the fallback function that only allows Admin to send Ethers to the contract's fallback function.

## Audited Contracts

The marketplace contract extended features of audited contracts from Zeppelin (`Ownable`, `Pausable`, `Destructible`, `SafeMath`)
