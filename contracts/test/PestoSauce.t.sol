// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import { CONTRACT_DEPLOYER } from "test/Constants.t.sol";
import { Test } from "forge-std/Test.sol";
import { PestoSauce } from "../src/PestoSauce.sol";

contract PestoSauceTest is Test {
    // Test Contract
    PestoSauce public pestoSauce;

    // Test Storage
    address owner = address(this);

    function setUp() public {
        // Deploy PestoSauce
        vm.prank(CONTRACT_DEPLOYER);
        pestoSauce = new PestoSauce("Pesto Sauce Collection", "PSC");
    }
}
