// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Transparent upgradeable proxy pattern

// The 'Implementation Contract'
contract CounterV1 {
    uint public count;

    function inc() external {
        count += 1;
    }

    // Just to check 'same fun call' for admins and users.
    function admin() external pure returns (address) {
        return address(1);
    }

    function implementation() external pure returns (address) {
        return address(2);
    }
}

// V2 of 'Implementation Contract that we deploy from Proxy contract'
contract CounterV2 {
    uint public count;

    function inc() external {
        count += 1;
    }
    function dec() external {
        count -= 1;
    }
}

// 'BuggyProxy' will be deployed with a '0xaddress' by default which we then need to 'upgradeTo' CounterV1(implementation) contract.

// How to call a function in 'Implemented Contract' from Proxy Contract ? (In Remix flow of deployment)
// 1. Copy the addr of proxy contract
// 2. Load Implented contract interface from dropdown and deploy it 'At Address' of proxy.

contract BuggyProxy {
    address public implementation;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // Delegatecall ==> Delegatecall are mostly used inside a proxy contracts, which forward function calls to an implementation contract.
    // Suppose we have contract A and contract B. On delegateCall'ing a function from contract A to contract B,
    // function executions are happened in contract B, but the updates are reflected in contract A instead of contract B.

    function _delegate() private {
        (bool ok, bytes memory res) = implementation.delegatecall(msg.data);
        require(ok, "delegateCall failed");
    }

    fallback() external payable {
        _delegate();
    }

    receive() external payable {
        _delegate();
    }

    // We can upgrade CounterV1 to Counter V2 by passing the new implementation here.
    function upgradeTo(address _implementation) external {
        require(msg.sender == admin, "not authorized");
        implementation = _implementation;
    }
}

contract Dev {
    function selectors() external view returns (bytes4, bytes4, bytes4) {
        return (
            Proxy.admin.selector,
            Proxy.implementation.selector,
            Proxy.upgradeTo.selector
        );
    }
}

// The Updated version of 'BuggyProxy' contract which previosly had issued with returning 'count' from 'CounterV1' contract
// which we then resolved with proper fallback returns.

contract Proxy {
    // All functions / variables should be private, forward all calls to fallback

    // -1 for unknown preimage (for security purposes ==> if not, its easy to detect preimage of hashes. 
    // Also subtracting from uint makes hashed value more random(collision attack is difficult) than doing the same from straight keccak hash).

    // 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
    bytes32 private constant IMPLEMENTATION_SLOT = 
        bytes32(uint(keccak256('eip1967.proxy.implementation')) - 1);
    // 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103
    bytes32 private constant ADMIN_SLOT = 
        bytes32(uint(keccak256('eip1967.proxy.admin')) - 1);

    constructor() {
        _setAdmin(msg.sender);
    }

    // Since we have same selectors(define selectors later), some function in proxy contract might trigger first instead of fun with same name in implementation contract.
    // This shall not happen as we deploy proxies with implementation interfaces. So we create different interfaces for admin and users.

    // In cases where we can't turn every fun into private, create modifiers to restrict access.
    // See "Function Clashing" here : https://forum.openzeppelin.com/t/beware-of-the-proxy-learn-how-to-exploit-function-clashing/1070
    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) { // we use func instead of state variables because they are stored in ADMIN_SLOTs.
            _;
        } else {
            _fallback(); // We created '_fallback()' internal func separately. Because we can't return actual 'fallback()' which is external.
        }
    }

    function _getAdmin() private view returns (address) {
        return StorageSlot.getAddressSlot(ADMIN_SLOT).value;
    }

    function _setAdmin(address _admin) private {
        require(_admin != address(0), "admin = zero addr");
        StorageSlot.getAddressSlot(ADMIN_SLOT).value = _admin;
    }

    function _getImplementation() private view returns (address) {
        return StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value;
    }

    function _setImplementation(address _implementation) private {
        require(_implementation.code.length > 0, "implementation is not a contract"); //Externally owned acc's can also be detected this way.
        StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value = _implementation;
    }

    // Admin interface //
    // We can set the admin for proxy contract through this func which is basically the addr of "ProxyAdmin" contract.
    function changeAdmin(address _admin) external ifAdmin {
        _setAdmin(_admin);
    }

    // 0x3659cfe6
    function upgradeTo(address _implementation) external ifAdmin {
        _setImplementation(_implementation);
    }

    // 0xf851a440
    function admin() external ifAdmin returns (address) {
        return _getAdmin();
    }

    function implementation() external ifAdmin returns (address) {
        return _getImplementation();
    }
    
    // From Openzeppelin's Transparent Upgradeable Proxy contract.
    // User interface //
    function _delegate(address _implementation) internal virtual {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.

            // calldatacopy(t, f, s) - copy s bytes from calldata at position f to memory at position t
            // calldatasize() - size of call data in bytes
            calldatacopy(0, 0, calldatasize()) // inShort==>copying calldata into memory.

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.

            // delegatecall(g, a, in, insize, out, outsize) -
            // - call contract at address a
            // - with input mem[in…(in+insize))
            // - providing g gas
            // - and output area mem[out…(out+outsize))
            // - returning 0 on error (eg. out of gas) and 1 on success
            let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            // returndatacopy(t, f, s) - copy s bytes from returndata at position f to mem at position t
            // returndatasize() - size of the last returndata
            returndatacopy(0, 0, returndatasize()) // inShort==> Here we copy the data from memory that we stored before

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                // revert(p, s) - end execution, revert state changes, return data mem[p…(p+s))
                revert(0, returndatasize())
            }
            default {
                // revert(p, s) - end execution, return data mem[p…(p+s))
                return(0, returndatasize())
            }
        }
    }

    // Referencing the state variable implementation.
    function _fallback() private {
        _delegate(_getImplementation());
    }

    fallback() external payable {
        _fallback();
    }

    receive() external payable {
        _fallback();
    }
}

// If the admin of proxy contract calls some fun(admin(), implementation()) inside implementation contract(CounterV1), then won't be able to do it.
// So we create this contract which will act as the 'Admin' of Proxy Contract.
contract ProxyAdmin {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    // Since the admin() and implementation() of proxy contract are not read-only func(because of modifiers prone to changes), 
    // we access data through staticcall and make it read-only.
    function getProxyAdmin(address proxy) external view returns (address) {
        (bool ok, bytes memory res) = proxy.staticcall(abi.encodeCall(Proxy.admin, ()));
        require(ok, "call failed");
        return abi.decode(res, (address)); //convert res from type 'bytes' into 'address'.
    }

    function getProxyImplementation(address proxy) external view returns (address) {
        (bool ok, bytes memory res) = proxy.staticcall(abi.encodeCall(Proxy.implementation, ()));
        require(ok, "call failed");
        return abi.decode(res, (address));
    }

    //'payable' func because proxies have fallback() and receive()
    function changeProxyAdmin(address payable proxy, address admin) external onlyOwner {
        Proxy(proxy).changeAdmin(admin);
    }

    function upgrade(address payable proxy, address implementation) external onlyOwner {
        Proxy(proxy).upgradeTo(implementation);
    }
}
// Now any update to implementation contract has to be done from "ProxyAdmin".

// All Implementation Contract must have the same storage loc as the Proxy Contract (Here "Implementation" and "Admin" as the state variables).
// To Write any storage for Implementation contracts, we create a 'library' and a 'separate contract' to test library.

library StorageSlot {
    struct AddressSlot {
        address value;
    }

    // Function that on providing pointer of the storage location, it will then return it into storage 'r'.
    function getAddressSlot(
        bytes32 slot
    ) internal pure returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
    }
}

contract TestSlot {
    bytes32 public constant slot = keccak256("TEST_SLOT");

    function getSlot() external view returns (address) {
        return StorageSlot.getAddressSlot(slot).value;
    }

    function writeSlot(address _addr) external {
        StorageSlot.getAddressSlot(slot).value = _addr;
    }
}
