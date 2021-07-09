// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

abstract contract ERC20Interface{
    string public name;
    string public symbol;
    uint8 public decimals;
    uint public totalSupply;
    
    function tansfer(address to, uint tokens) public virtual returns (bool success);
    function transferFrom(address from, address to, uint tokens) public virtual returns (bool success);
    function approve(address spender, uint tokens) public virtual returns (bool success);
    function allowance(address tokenOwner, address spender) public view virtual returns (uint remaining);
    
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract ERC20Impl is ERC20Interface {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping (address=> uint256)) internal allowed;
    
    constructor() {
        decimals = 2;
        totalSupply = 10000000000 * 10 ** uint256(decimals);
        name="Zhi Min Token";
        symbol = "ZM";
        balanceOf[msg.sender] = totalSupply;
    }
    
    function tansfer(address to, uint tokens) public virtual override returns (bool success) {
        require(to != address(0));
        require(balanceOf[msg.sender] >= tokens);
        require(balanceOf[to]+tokens >= balanceOf[to]);
        
        balanceOf[msg.sender]-=tokens;
        balanceOf[to]+=tokens;
        emit Transfer(msg.sender, to, tokens);
        success = true;
    }
    
    function transferFrom(address from, address to, uint tokens) public  virtual override returns (bool success){
        require(to != address(0) && from != address(0));
        require(balanceOf[from] >= tokens);
        require(allowed[from][msg.sender] <= tokens);
        require(balanceOf[to]+tokens >= balanceOf[to]);
        
        balanceOf[from] -= tokens;
        balanceOf[to] += tokens;
        emit Transfer(from, to, tokens);
        success = true;
    }
    
    function approve(address spender, uint tokens) public virtual override returns (bool success){
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        success = true;
    }
    
    function allowance(address tokenOwner, address  spender) public view virtual override returns (uint remaining){
        return allowed[tokenOwner][spender];
    }
}
