pragma solidity ^0.4.24;

contract SimpleCBDCurrency {

    address public centralbank;
    mapping (address => uint256) private _balances;
    uint256 private _totalSupply;

    constructor() public {
        centralbank = msg.sender;
        _totalSupply = 0;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function mint(uint256 amount) public {
        require(msg.sender == centralbank);
        _totalSupply = _totalSupply + amount;
        _balances[centralbank] = _balances[centralbank] + amount;
    }

}