import React, { useState, useCallback, useEffect, useContext } from "react";
import { Spinner } from "../common/Spinner";
import { AppContext } from "../../context/context";
import { AppActionTypes } from "../../reducers/appReducer";
import { ethers } from "ethers";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { uploadDataToArweave } from "@/resources";
import { FormButton } from "../common/FormButton";
import { FILE_SIZE } from "../../constants";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { getCollectionInstance } from "@/lib/contracts";
import { MARKET_MASTER_ADDRESS__GOERLI } from "../../constants";
import { useUser } from "@/context/user-context";

type Props = {
  onClickBack: any;
  fireFetch: any;
  address: any;
};

export function MintPictureForm(props: Props) {
  // General state.
  const user = useUser();
  // Component state
  const [minted, setMinted] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [image, setImage] = useState<string | any>("");
  const [mimeType, setMimeType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // Component/Form errors
  const [imageError, setImageError] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleErrors = () => {
    let imageError;
    if (fileName?.length == 0 || !fileName) {
      setImageError("Image can't be empty");
      imageError = true;
    }
    if (imageError) return true;
    else return false;
  };

  const handleMintverso = async () => {
    if (loading) return;
    setLoading(true);

    let error = handleErrors();
    if (error) {
      setLoading(false);
    } else {
      let creator = user?.profile?.metadata.handle;
      let isPrivate = false;
      let timestamp = new Date().getTime();
      let metadata = await uploadDataToArweave({
        title,
        description,
        image,
        mimeType,
        creator,
        isPrivate,
        timestamp,
      });
      console.log(metadata);
      await mintNewVerso(metadata);
      // let newTokenID = await mintNewVerso(metadata);
      // handleRedirect(newTokenID as string, props.address);
      // setMinted(true);
      props.onClickBack();
      props.fireFetch();
      resetInitialState();
    }
  };

  const mintNewVerso = async (metadata: any) => {
    if (!user?.wallet) {
      return;
    }

    try {
      const provider = await user.wallet.getEthersProvider();
      const signer = provider.getSigner();

      let collection = getCollectionInstance(props.address, signer);

      let mint = await collection.create(
        metadata.url,
        user.wallet.address,
        "0x0000000000000000000000000000000000000000",
        MARKET_MASTER_ADDRESS__GOERLI,
        "100000000000000000",
        0,
        true,
        true
      );

      let receipt = await mint.wait();
      console.log("receipt: ", receipt);
    } catch (e) {
      setError(e as any);
      setLoading(false);
      console.log(e);
    }
  };

  const handleRedirect = (tokenId: string, receipient: string) => {};

  const resetInitialState = () => {
    setTitle("");
    setDescription("");
    setFileName(undefined);
    setImage("");
    setLoading(false);
    setImageError("");
    setError("");
    setMinted(false);
  };

  const handleImageUpload = useCallback((e: any) => {
    let file = e.target.files[0];
    e.preventDefault();
    if (file.size > FILE_SIZE) {
      setImageError("File too big. 3mb maximum.");
    } else if (file.size <= FILE_SIZE) {
      setImageError("");
    }

    if (!!file) {
      let reader = new FileReader();
      reader.onload = () => {
        let imageBase64 = reader.result as string;
        let trimed64 = imageBase64.split(",")[1];
        setImage(trimed64);
        setMimeType(file.type);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <div className="bg-white h-screen">
      <div
        className={`w-full h-full py-4 ${
          props.onClickBack ? "px-6" : "lg:px-96"
        }`}
      >
        {props.onClickBack ? (
          <div onClick={props.onClickBack} className="pt-2 pb-8">
            <ArrowLeftIcon className="w-6 h-6 text-black" />
          </div>
        ) : null}

        <h1 className="text-zinc-800 font-lora font-light text-2xl md:text-3xl mb-4">
          New Verso
        </h1>

        <div className="w-full h-full flex flex-col ">
          <div className="">
            <label className="w-full flex flex-col">
              <p className="text-sm font-lora text-accent6 py-2">Title</p>
              <input
                type="text"
                name="title"
                value={title}
                placeholder="optional"
                className="h-12 lg:h-14 px-2 font-light placeholder:italic font-lora text-zinc-700 text-sm bg-zinc-100 focus:outline-none"
                onChange={(e) => setTitle(e.target.value)}
              ></input>
            </label>
          </div>

          <div className="">
            <label className="w-full flex flex-col">
              <p className="text-sm font-lora text-accent6 py-2">Description</p>

              <textarea
                name="description"
                value={description}
                placeholder="optional"
                className="h-20 pt-2 px-2 font-light placeholder:italic font-lora text-zinc-700 text-sm bg-zinc-100 focus:outline-none"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>
          </div>

          <div className={``}>
            <label className="h-full w-full flex flex-col">
              <p className="text-sm font-lora text-accent6 py-2">Media *</p>
              <div className="flex flex-col items-center justify-center cursor-pointer font-light font-lora text-zinc-700 text-sm bg-zinc-100 focus:outline-none">
                {!fileName ? (
                  <div className="py-2">
                    <p className="font-lora text-xs text-center text-zinc-800 font-semibold">
                      Click to upload
                    </p>
                    <p className="font-lora text-xs text-center text-zinc-600">
                      PNG, JPG or JPGE{" "}
                    </p>
                    <p className="font-lora text-xs text-center text-zinc-800 font-semibold">
                      3MB max
                    </p>
                  </div>
                ) : (
                  <p className="text-zinc-800 text-xs font-semibold py-6">
                    {fileName}
                  </p>
                )}
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept=".jpg, .jpge, .png"
                className="opacity-0 z-40"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="">
            {imageError ? (
              <p className="text-rose-700 text-xs font-semibold font-lora mb-4">
                {imageError}
              </p>
            ) : null}

            <FormButton
              text={"Mint Verso"}
              loading={loading}
              onClick={handleMintverso}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
