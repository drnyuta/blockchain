// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameCharacterCollection is ERC1155, Ownable {
    string public name;
    mapping(uint256 => uint256) private _totalSupply;

    constructor(string memory _name, string memory _baseURI) ERC1155(_baseURI) Ownable(msg.sender) {
        name = _name;
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        _mint(to, id, amount, data);
        _totalSupply[id] += amount;
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        _mintBatch(to, ids, amounts, data);
        for (uint256 i = 0; i < ids.length; i++) {
            _totalSupply[ids[i]] += amounts[i];
        }
    }

    function totalSupply(uint256 id) public view returns (uint256) {
        return _totalSupply[id];
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(tokenId)));
        // Expects baseURI like: ipfs://CID/ and resolves as ipfs://CID/0.json, 1.json, etc.
    }
}