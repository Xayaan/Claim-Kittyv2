import { useWeb3React } from "@web3-react/core";

import type1 from "../Materials/01.jpg";
import type2 from "../Materials/02.jpg";
import type3 from "../Materials/03.jpg";

// import abi file
import NftManagerAbi from "../blockchain/abi/NftManager.json";
import KittieNftAbi from "../blockchain/abi/KittieNft.json";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  NFT_CONTRACT_ADDRESS
} from "../blockchain/addresses";
import Web3 from "web3";

function App() {
  const { active, account, library, activate, deactivate, chainId } =
    useWeb3React();

  const [popupMessage, setPopupMessage] = useState("");

  const [isMintingOneLoading, setIsMintingOneLoading] = useState(false);
  const [isMintingTwoLoading, setIsMintingTwoLoading] = useState(false);
  const [isMintingThreeLoading, setIsMintingThreeLoading] = useState(false);

  const [merkleProofL1, setMerkleProofL1] = useState([]);
  const [merkleProofL2, setMerkleProofL2] = useState([]);

  // state for store selected type of check list number
  const [selectedType, setSelectedType] = useState(1);

  let kittieNft1: any;
  let kittieNft2: any;
  let kittieNft3: any;


  if (library) {
    kittieNft1 = new library.eth.Contract(KittieNftAbi, NFT_CONTRACT_ADDRESS[String(chainId)].KittieNft1);
    kittieNft2 = new library.eth.Contract(KittieNftAbi, NFT_CONTRACT_ADDRESS[String(chainId)].KittieNft2);
    kittieNft3 = new library.eth.Contract(KittieNftAbi, NFT_CONTRACT_ADDRESS[String(chainId)].KittieNft3);
  }

  useEffect(() => {
    if (account) {
      // get proofs
      getProof(account, "1").then((proof) => {
        setMerkleProofL1(proof);
      });
      getProof(account, "2").then((proof) => {
        setMerkleProofL2(proof);
      });
    }
  }, [account]);

  async function showTimeBoundPopup(list: string) {
    const currentDate = new Date();
    const startDateTimeBound1 = new Date('2023-12-25T00:00:00Z');
    const endDateTimeBound1 = new Date('2024-06-25T23:59:59Z');
    const startDateTimeBound2 = new Date('2024-06-26T00:00:00Z');
    const endDateTimeBound2 = new Date('2024-12-26T23:59:59Z');

    const isInFirstTimeBound = currentDate >= startDateTimeBound1 && currentDate <= endDateTimeBound1;
    const isInSecoundTimeBound = currentDate >= startDateTimeBound2 && currentDate <= endDateTimeBound2;

    let popupMessage = "The eligible address will be able to claim their free NFT during these time bounds:\n";
    const timeCheckCondition = list === "1" ? isInFirstTimeBound : isInSecoundTimeBound;

    if (timeCheckCondition) {
      popupMessage = "You are on the list " + list + ". You can Mint NFT.";
    } else {
      popupMessage += list === "1" ?
        `From 25 December 2023 to 25 June 2024.\n` :
        `From 26 June 2024 to 26 December 2024.`
    }

    toast((t) => {
      return (
        <div className="popup-box">
          <h3>
            {popupMessage}
          </h3>

          <button
            className="close-btn"
            onClick={() => {
              toast.dismiss(t.id)
            }}
          >
            close
          </button>
        </div>
      )
    },
      {
        duration: 5000000,
        position: "bottom-center"

      }
    );

  }

  function callStyledToast() {


  }

  // function for all api
  // api url https://merkle-tree-nft-api.vercel.app/
  async function getProof(address: string, listNumber: string) {
    const res = await fetch(
      "https://kittie-nft-whitelist-api.vercel.app" +
      "/get_proof_by_address/" +
      listNumber +
      "/1/" +
      address
    );
    const proof = await res.json();
    return proof;
  }



  // function for all api
  // api url https://merkle-tree-nft-api.vercel.app/
  async function getProof2(address: string, listNumber: string) {
    // address = "0xed69c11b29af3cc02aeca559036645c4bfcea10a"
    try {
      console.log("checking list");

      const res = await fetch(
        "https://kittie-nft-whitelist-api.vercel.app" +
        "/get_proof_by_address/" +
        listNumber +
        "/1/" +
        address
      );

      const data = await res.json();
      console.log("getProof2", data);

      if (data.length === 0) {
        toast((t) => {
          return (
            <div className="popup-box">
              <h3>
                {"You are not on the list " + listNumber}
              </h3>

              <button
                className="close-btn"
                onClick={() => {
                  toast.dismiss(t.id)
                }}
              >
                Close
              </button>
            </div>
          )
        },
          {
            duration: 5000000,
            position: "bottom-center"

          }
        );
      } else {
        showTimeBoundPopup(listNumber)
      }
    } catch (error) {
      console.log("getProof2: error", error);

    }
  }

  async function calculateMintingCost(
    type: number,
    mintAmount: number,
    merkleProofL1: string[],
    merkleProofL2: string[]
  ) {
    switch (type) {
      case 1:
        return await kittieNft1.methods
          .calculateMintingCost(
            account,
            mintAmount,
            merkleProofL1,
            merkleProofL2
          )
          .call();
      case 2:
        return await kittieNft2.methods
          .calculateMintingCost(
            account,
            mintAmount,
            merkleProofL1,
            merkleProofL2
          )
          .call();
      case 3:
        return await kittieNft3.methods
          .calculateMintingCost(
            account,
            mintAmount,
            merkleProofL1,
            merkleProofL2
          )
          .call();
      default:
        break;
    }
    return await kittieNft1.methods
      .calculateMintingCost(account, mintAmount, merkleProofL1, merkleProofL2)
      .call();
  }



  // function for minting
  async function mintNFT(type: number) {
    const mintAmount = 1;
    switch (type) {
      case 1:
        setIsMintingOneLoading(true);
        break;
      case 2:
        setIsMintingTwoLoading(true);
        break;
      case 3:
        setIsMintingThreeLoading(true);
        break;
      default:
        break;
    }

    const _mintingCost = await calculateMintingCost(
      type,
      mintAmount,
      merkleProofL1,
      merkleProofL2
    );

    const mintingCost = Web3.utils.fromWei(String(_mintingCost), "ether");


    const _ethBalance = await library.eth.getBalance(account);
    const ethBalance = Web3.utils.fromWei(String(_ethBalance), "ether");



    console.log("ethBalance", ethBalance);
    console.log("mintingCost", mintingCost);
    console.log("consition", Number(ethBalance) < Number(mintingCost));

    if (Number(ethBalance) < Number(mintingCost)) {
      toast.error("You don't have enough ETH to mint this NFT.");
      setIsMintingOneLoading(false);
      setIsMintingTwoLoading(false);
      setIsMintingThreeLoading(false);
      return;
    }

    switch (type) {
      case 1:
        await kittieNft1.methods
          .mint(account, mintAmount, merkleProofL1, merkleProofL2)
          .send({ from: account, value: _mintingCost })
          .then(
            (res: any) => {
              console.log(res);
              toast.success("Minted Successfully");
              setIsMintingOneLoading(false);
            },
            (err: any) => {
              console.log(err);
              toast.error(err.message);
              setIsMintingOneLoading(false);
            }
          );
        break;
      case 2:
        await kittieNft2.methods
          .mint(account, mintAmount, merkleProofL1, merkleProofL2)
          .send({ from: account, value: _mintingCost })
          .then(
            (res: any) => {
              console.log(res);
              toast.success("Minted Successfully");
              setIsMintingTwoLoading(false);
            },
            (err: any) => {
              console.log(err);
              toast.error(err.message);
              setIsMintingTwoLoading(false);
            }
          );
        break;
      case 3:
        await kittieNft3.methods
          .mint(account, mintAmount, merkleProofL1, merkleProofL2)
          .send({ from: account, value: _mintingCost })
          .then(
            (res: any) => {
              console.log(res);
              toast.success("Minted Successfully");
              setIsMintingThreeLoading(false);
            },
            (err: any) => {
              console.log(err);
              toast.error(err.message);
              setIsMintingThreeLoading(false);
            }
          );
        break;
      default:
        break;
    }

    console.log(mintingCost);
  }

  return (
    <div className="container-background">
      <div className="contant_section">
        <div>
          <h1>Minting Page</h1>
          <p>
            ClaimKitty has now released its NFTs Collection! <br /> Buy your
            NFTs and get benefits such as discounts on new AirDrop creation and
            distribution of royalties <br /> among holders. There are four types
            of NFTs: each one has different traits, rarity and discounts for{" "}
            <br /> AirDrop Fee Creation.
          </p>
        </div>
      </div>

      <section>
        <div className="box_section">
          <div className="box1">
            <img src={type1} style={{ width: "9rem" }} alt="" />
            <h3>Type#1</h3>
            <h3>
              Cap <span>10,000</span>
            </h3>
            <h3>
              Discount <span>98%</span>
            </h3>
            <button
              className="btn1"
              onClick={() => {
                mintNFT(1).then(() => { });
              }}
            >
              Mint Now
              {isMintingOneLoading ? <div className="loader"></div> : null}
            </button>
          </div>
          <div className="box1">
            <img src={type2} style={{ width: "9rem" }} alt="" />
            <h3>Type#2</h3>
            <h3>
              Cap <span>20,000</span>
            </h3>
            <h3>
              Discount <span>60%</span>
            </h3>
            <button
              className="btn1"
              onClick={() => {
                mintNFT(2).then(() => { });
              }}
            >
              Mint Now
              {isMintingTwoLoading ? <div className="loader"></div> : null}
            </button>
          </div>
          <div className="box1">
            <img src={type3} style={{ width: "9rem" }} alt="" />
            <h3>Type#3</h3>
            <h3>
              Cap <span>30,000</span>
            </h3>
            <h3>
              Discount <span>30%</span>
            </h3>
            <button
              className="btn1"
              onClick={() => {
                mintNFT(3).then(() => { });
              }}
            >
              Mint Now
              {isMintingThreeLoading ? <div className="loader"></div> : null}
            </button>
          </div>
        </div>
      </section>

      <div className="freemint">
        <div className="freemint-contant"></div>
        <div className="freemint-contant">
          <h1>Check if you are elegible for Free-Mint NFT.</h1>
          <p>
            ClaimKitty team has worked on two lists of addresses elegible for
            free-mint NFTs: the first one goes from <br /> 15/02/2023 to
            15/08/2023, the second one from 15/08/2023 to 15/02/2024. Click on
            the buttons below to show the two lists.
          </p>
          <div className="twobtn">
            <button
              className="btn1 selected-button"
              onClick={async () => {
                setSelectedType(1);
              }}
            >
              Type 1
            </button>
            <button
              className="btn1"
              onClick={async () => {
                setSelectedType(2);
              }}
            >
              Type 2
            </button>
            <button
              className="btn1"
              onClick={async () => {
                setSelectedType(3);
              }}
            >
              Type 3
            </button>
          </div>
          <div className="twobtn">
            <button
              className="btn1"
              onClick={async () => {
                if (account) {
                  await getProof2(account, "1");
                } else {
                  toast("Please connect your wallet");
                }
              }}
            >
              {" "}
              Check 1st List
            </button>
            <button
              className="btn1"
              onClick={async () => {
                if (account) {
                  await getProof2(account, "2");
                } else {
                  toast("Please connect your wallet");
                }
              }}
            >
              {" "}
              Check 2nd List
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
