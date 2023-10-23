const colors = require('colors');
import { ethers } from 'hardhat';
const test_util = require('./util');


// import { NftManager } from '../NftManager';
import { KittieNft, MerkleFactory } from '../typechain';
import { parseEther } from 'ethers/lib/utils';

async function main() {
    console.log("Deploying NFTs");

    let merkleFactoryContract: MerkleFactory;
    let kittieNft1: KittieNft;
    let kittieNft2: KittieNft;
    let kittieNft3: KittieNft;

    const deployedAddress = {
        chainId: '',
        MerkleFactory: "",
        KittieNft1: "",
        KittieNft2: "",
        KittieNft3: "",
    }

    // get signer
    const [signer] = await ethers.getSigners()
    const chainId = await signer.getChainId();
    if (signer === undefined) throw new Error('Deployer is undefined.')
    console.log(colors.cyan('Deployer Address: ') + colors.yellow(signer.address));
    console.log(colors.yellow('Deploying on Chain: ', chainId));

    deployedAddress.chainId = String(chainId);
    const merkleFactory = await ethers.getContractFactory("MerkleFactory");

    const _weth: any = {
        "1": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//Ethereum
        "5": "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",//goerli
        "10": "0x4200000000000000000000000000000000000006",//Optimism
        "25": "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",//Cronos
        "56": "0x2170ed0880ac9a755fd29b2688956bd959f933f8", //BSC
        "137": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", //Polygon
        "250": "0x74b23882a30290451a17c44f4f05243b6b58c76d", //Fantom
        "1285": "0xab3f0245b83feb11d15aaffefd7ad465a59817ed", //Moonriver
        "43114": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", //Avalanche
        "42161": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1" //Arbitrum
    };



    const owner = "0x3EbE9fDe950b8935B13856e3A814c7E938E84bB9";
    const feeAddress = "0x29098cb178A7dF6E6124a399Df6859e1418FaCA6";
    const validator = "0x0624F128556552Fb1dACdd33E225443A08Ad6128";

    if (!_weth[String(chainId)]) throw new Error('Weth not defined.')
    // merkleFactoryContract = await merkleFactory.deploy(_weth[String(chainId)], owner, feeAddress, validator) as MerkleFactory;
    // await merkleFactoryContract.deployed()

    // console.log(colors.cyan('MerkleFactory: Contract Address: ') + colors.yellow(merkleFactoryContract.address));
    // console.log(colors.yellow('verifying...'));
    // await test_util.sleep(30);
    // await test_util.verify(merkleFactoryContract.address, 'MerkleFactory', [_weth[String(chainId)], owner, feeAddress, validator]);
    // deployedAddress.MerkleFactory = merkleFactoryContract.address;

    let contractName = "KittieNft"
    let contractFactory = await ethers.getContractFactory(contractName);

    // deploy KittieNft 1
    kittieNft1 = await contractFactory.deploy(
        1,
        98,
        parseEther("0.03"), // _cost
        10000, // _maxSupply
        "Bastepaat", // _name
        "BAST", // _symbol
        "https://api.kitties.com/kitties/", // _initBaseURI
        feeAddress
    ) as KittieNft;
    await kittieNft1.deployed()
    console.log(colors.cyan('NFT1: Contract Address: ') + colors.yellow(kittieNft1.address));
    console.log(colors.yellow('verifying...'));
    await test_util.sleep(60);
    await test_util.verify(kittieNft1.address, contractName, [1, 98, parseEther("0.03"), 10000, "Bastepaat", "Bastepaat", "https://api.kitties.com/kitties/", feeAddress])
    deployedAddress.KittieNft1 = kittieNft1.address;

    return

    // deploy KittieNft 2
    kittieNft2 = await contractFactory.deploy(
        2,
        60,
        parseEther("0.015"), // _cost
        20000, // _maxSupply
        "Mafdet", // _name
        "BAST", // _symbol
        "https://api.kitties.com/kitties/", // _initBaseURI
    ) as KittieNft;
    await kittieNft2.deployed()
    console.log(colors.cyan('NFT2: Contract Address: ') + colors.yellow(kittieNft2.address));
    console.log(colors.yellow('verifying...'));
    await test_util.sleep(30);
    await test_util.verify(kittieNft2.address, contractName, [2, 60, parseEther("0.015"), 20000, "Mafdet", "BAST", "https://api.kitties.com/kitties/"])
    deployedAddress.KittieNft2 = kittieNft2.address;

    // deploy KittieNft 3
    kittieNft3 = await contractFactory.deploy(
        3,
        30,
        parseEther("0.005"), // _cost
        20000, // _maxSupply
        "Shumose", // _name
        "BAST", // _symbol
        "https://api.kitties.com/kitties/", // _initBaseURI
    ) as KittieNft;
    await kittieNft3.deployed()
    console.log(colors.cyan('NFT3: Contract Address: ') + colors.yellow(kittieNft2.address));
    console.log(colors.yellow('verifying...'));
    await test_util.sleep(30);
    await test_util.verify(kittieNft2.address, contractName, [3, 30, parseEther("0.005"), 30000, "Shumose", "BAST", "https://api.kitties.com/kitties/"])
    deployedAddress.KittieNft3 = kittieNft3.address;

    console.log(deployedAddress)
}

main()
    .then(async () => {
        console.log("Done")
    })
    .catch(error => {
        console.error(error);
        return undefined;
    })
