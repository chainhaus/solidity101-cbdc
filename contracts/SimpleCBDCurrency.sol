pragma solidity ^0.4.24;

contract SimpleCBDCurrency {

    address public centralbank;
    mapping (address => uint256) private _banks;
    uint256 private _moneySupply;

    constructor() public {
        centralbank = msg.sender;
        _moneySupply = 0;
    }

    function moneySupply() public view returns (uint256) {
        return _moneySupply;
    }

    function mint(uint256 amount) public {
        require(msg.sender == centralbank);
        _moneySupply = _moneySupply + amount;
        _banks[centralbank] = _banks[centralbank] + amount;
    }

}