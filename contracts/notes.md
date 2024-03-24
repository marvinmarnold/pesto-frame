# Notes

Implementation with URI verification to ensure that the URI came from the trusted backend:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { Ownable } from "src/dependencies/Ownable.sol";
import { ECDSA } from "src/dependencies/ECDSA.sol";
import { ERC721 } from "solmate/tokens/ERC721.sol";
import { SafeTransferLib, ERC20 } from "solmate/utils/SafeTransferLib.sol";
import { Strings } from "openzeppelin-contracts/contracts/utils/Strings.sol";

contract PestoSauce is Ownable, ERC721 {
    using ECDSA for bytes32;

    // Constants: no SLOAD to save gas
    uint256 public constant MINT_FEE = 0.000001 ether;
    address private constant CONTRACT_DEPLOYER = 0xb1349F61e587b23A2072C23C7d2F119eE6265d7f;

    // Storage
    uint256 public currentTokenId;
    address public backendEOA;
    mapping(address => uint256[]) public tokenIds;
    mapping(uint256 => string) public tokenURIs;

    // Events
    event Mint(address indexed recipient, uint256 indexed tokenId, string URI);

    // Errors
    error Unauthorized();
    error InsufficientFunds();

    constructor(address _owner, address _backendEOA, string memory _name, string memory _symbol)
        Ownable(_owner)
        ERC721(_name, _symbol)
    {
        if (msg.sender != CONTRACT_DEPLOYER) revert Unauthorized();
        backendEOA = _backendEOA;
    }

    function mintTo(
        address _recipient,
        string _URI,
        bytes32 _messageHash,
        bytes calldata _signature,
        uint256 _sigTimestamp
    ) public payable returns (uint256 newTokenId) {
        // Ensure the sender has paid the mint fee
        if (msg.value < MINT_FEE) revert InsufficientFunds();

        // Ensure the URI came from the backend
        bytes32 computedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encodePacked(_URI, _sigTimestamp)))
        );
        require(computedMessageHash == _messageHash, "Message hash does not match");
        if (ECDSA.recover(_messageHash, _signature) != backendEOA) revert Unauthorized();
        require(_sigTimestamp >= block.timestamp - 2 minutes, "Signature expired");

        // Increment the token ID and link it to the URI
        newTokenId = currentTokenId++;
        tokenURIs[newTokenId] = _URI;

        // Mint the token and emit the event
        _safeMint(_recipient, newTokenId);
        emit Mint(_recipient, newTokenId, _URI);
    }

    function getTokenIds(address _tokenOwner) public view returns (uint256[] memory) {
        return tokenIds[_tokenOwner];
    }

    function tokenURI(uint256 _id) public view virtual override returns (string memory) {
        return tokenURIs[_tokenId];
    }

    // Admin Functions
    function extractNative() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function extractERC20(address _token) public payable onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        SafeTransferLib.safeTransfer(ERC20(_token), msg.sender, balance);
    }
}
```
