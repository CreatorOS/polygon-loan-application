
const hre = require("hardhat");

async function main() {
    const LoanRequest = await hre.ethers.getContractFactory("LoanRequest");
    const signers = await ethers.getSigners()
    const loanPurpose = Math.random().toString().substr(0, 4)
    const loanAmount = parseInt(Math.floor(Math.random() * 100));
    const payoffAmount = parseInt(Math.floor(Math.random() * 100))
    const loanDuration = parseInt(Math.floor(Math.random() * 100))
    const loanRequest = await LoanRequest.deploy(
        loanPurpose,
        loanAmount,
        payoffAmount,
        loanDuration
    );
    await loanRequest.deployed();
    console.log("LoanRequest deployed to:", loanRequest.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });