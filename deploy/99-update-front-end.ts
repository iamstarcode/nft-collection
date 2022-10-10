import { frontEndContractsFile, frontEndAbiFile } from "../helper-hardhat-config"
import fs from "fs"
import { ethers, network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const whiteList = await ethers.getContract("CryptoDevs")
    fs.writeFileSync(frontEndAbiFile, whiteList.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const whiteList = await ethers.getContract("CryptoDevs")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (network.config.chainId != undefined)
        if (network.config.chainId.toString() in contractAddresses) {
            if (!contractAddresses[network.config.chainId.toString()].includes(whiteList.address)) {
                contractAddresses[network.config.chainId.toString()].push(whiteList.address)
            }
        } else {
            contractAddresses[network.config.chainId.toString()] = [whiteList.address]
        }

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

export default func
func.tags = ["all", "frontend"]
