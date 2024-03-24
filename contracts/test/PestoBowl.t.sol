// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { CONTRACT_DEPLOYER } from "test/Constants.t.sol";
import { Test } from "forge-std/Test.sol";
import { PestoBowl } from "../src/PestoBowl.sol";

contract PestoBowlTest is Test {
    // Test Contract
    PestoBowl public pestoBowl;

    // Test Storage
    address owner = address(this);

    function setUp() public {
        // Deploy PestoBowl
        vm.prank(CONTRACT_DEPLOYER);
        pestoBowl = new PestoBowl(CONTRACT_DEPLOYER, "Pesto Bowl Collection", "PBC");
    }
}
