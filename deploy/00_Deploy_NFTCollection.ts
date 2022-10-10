import { DeployFunction } from "hardhat-deploy/types"
import { verify } from "../helper-functions"
import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../helper-hardhat-config"

const func: DeployFunction = async ({ deployments, getNamedAccounts, network }) => {
    const { deployer, log } = await getNamedAccounts()
    const { deploy } = deployments

    const args = ["http://localhost:3000/api/", "0x53437CA2e4e734735fD52a67cc6BC00264B04F76"]

    const waitConfirmation = developmentChains.includes(network.name) ? 1 : 3

    const cryptoDevs = await deploy("CryptoDevs", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitConfirmation,
    })

    if (!developmentChains.includes(network.name)) {
        await verify(cryptoDevs.address, args)
    }
}

func.tags = ["all", "nft"]
export default func
