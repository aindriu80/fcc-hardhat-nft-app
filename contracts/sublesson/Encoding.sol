// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Encoding{
    function combineStrings() public pure returns(string memory){
        return string(abi.encodePacked("Hi there! ", "We missed you!"));
    }

    // globally available methods & units

    function encodeNumber() public pure returns(bytes memory){
        bytes memory number = abi.encode(1);
        return number;
    }

    function encodeString() public pure returns(bytes memory){
        bytes memory someString= abi.encode("Some String");
        return someString;
    }

    function encodeStringPacked() public pure returns(bytes memory){
        bytes memory someString = abi.encodePacked("Some String");
        return someString;
    }
    
    function encodeStringBytes() public pure returns(bytes memory){
        bytes memory someString = bytes("Some String");
        return someString;    
    }

    function decodeString() public pure returns(string memory){
        string memory someString = abi.decode(encodeString(), (string));
        return someString;
    }

    function multiEncode() public pure returns(bytes memory){
        bytes memory someString = abi.encode("some string", "it's bigger");
        return someString;
    }

    function multiDecode() public pure returns(string memory, string memory){
        (string memory someString, string memory someOtherString) = abi.decode(multiEncode(), (string, string));
        return(someString, someOtherString);
    }

    function multiEncodePacked() public pure returns(bytes memory){
        bytes memory someString = abi.encodePacked("Some String", "It's Bigger!");
        return someString;
    }

    function multiStringCastPacked() public pure returns (string memory){
        string memory someString = string(multiEncodePacked());
        return someString;
    }

    // 1. ABI
    // 2. Contract Address
    // How do we send transactions that call functions with just the data field populated?
    // How do we populate the data field?

    function withdraw(address recentWinner) public{
        (bool success, ) = recentWinner.call{value: address(this).balance)("")};
        require success, "Transfer Failed");
    }



}