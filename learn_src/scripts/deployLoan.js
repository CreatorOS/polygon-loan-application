
const hre = require("hardhat");

async function main() {
    const Loan = await hre.ethers.getContractFactory("Loan");
    const loanDuration = parseInt(Math.floor(Math.random() * 100))
    const payoffAmount = parseInt(Math.floor(Math.random() * 100))
    signers = await ethers.getSigners()
    const loan = await Loan.deploy(
        signers[0].address,
        signers[1].address,
        payoffAmount,
        loanDuration
    );
    await loan.deployed();
    console.log("Loan deployed to:", loan.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });