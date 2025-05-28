// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SoulboundVisitCard is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    
    struct StudentInfo {
        string studentName;
        string studentId;
        string course;
        uint256 year;
    }

    mapping(uint256 => StudentInfo) private _studentInfo;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }

    function mint(
        address to,
        string memory studentName,
        string memory studentId,
        string memory course,
        uint256 year
    ) external onlyOwner {
        require(balanceOf(to) == 0, "Each address can only have one visit card");
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _studentInfo[tokenId] = StudentInfo(studentName, studentId, course, year);
        _tokenIdCounter++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        
        StudentInfo memory info = _studentInfo[tokenId];
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "', name(), ' #', tokenId.toString(), '",',
                        '"description": "Soulbound Student Visit Card",',
                        '"image": "', _baseTokenURI, '",',
                        '"attributes": [',
                        '{"trait_type": "Student Name", "value": "', info.studentName, '"},',
                        '{"trait_type": "Student ID", "value": "', info.studentId, '"},',
                        '{"trait_type": "Course", "value": "', info.course, '"},',
                        '{"trait_type": "Year", "value": ', info.year.toString(), '}',
                        ']}'
                    )
                )
            )
        );
        
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
       
        if (from != address(0) && to != address(0)) {
            revert("Soulbound tokens cannot be transferred");
        }
        
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert("Soulbound tokens cannot be approved");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound tokens cannot be approved");
    }
    
    function getStudentInfo(uint256 tokenId) public view returns (StudentInfo memory) {
        _requireOwned(tokenId);
        return _studentInfo[tokenId];
    }
}