import React, { useState, useCallback, useContext } from "react";
import { AppContext } from "../../context/context";
import { AppActionTypes } from "../../reducers/appReducer";
import { uploadDataToArweave } from "@/resources";
import { FormButton } from "../common/FormButton";
import {
  FILE_SIZE,
  MAX_INT,
  NULL_ADDRESS,
  SIMPLE_MARKET_ADDRESS__MAINNET,
} from "../../constants";
import { useRouter } from "next/router";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { getCollectionInstance } from "@/lib/contracts";
import { MARKET_MASTER_ADDRESS__GOERLI } from "../../constants";
import { useUser } from "@/context/user-context";
import { createPost } from "@/resources/posts/createPost";
import { BigNumber } from "ethers";

type Props = {
  onClickBack: any;
  fireFetch: any;
  address: any;
};

export function MintPictureForm(props: Props) {
  // General state.
  const user = useUser();
  const { dispatch } = useContext(AppContext);
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
      setImageError("Image can't be empty.");
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
      await mintNewVerso(metadata);
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
      const MARKET_ADDRESS =
        process.env.NEXT_PUBLIC_DEV == "true"
          ? MARKET_MASTER_ADDRESS__GOERLI
          : SIMPLE_MARKET_ADDRESS__MAINNET;
      let collection = getCollectionInstance(props.address, signer);
      let mint = await collection.create(
        metadata.url, // url
        props.address, // receipient
        NULL_ADDRESS, // permissions
        MARKET_ADDRESS, // market address
        "1000000000000", // supply limit
        0, // token price
        true, // isListed
        false // is bonded
      );
      let receipt = await mint.wait();
      const logDescription = collection.interface.parseLog(receipt.logs[0]);
      const tokenId: BigNumber = logDescription.args[3];

      await createPost(
        props.address,
        user.wallet.address,
        parseInt(tokenId._hex).toString()
      );

      dispatch({
        type: AppActionTypes.Set_Toaster,
        payload: {
          toaster: {
            render: true,
            success: true,
            message: "Verso Created!",
          },
        },
      });
    } catch (e) {
      setError(e as any);
      setLoading(false);
      dispatch({
        type: AppActionTypes.Set_Toaster,
        payload: {
          toaster: {
            render: true,
            success: false,
            message: undefined,
          },
        },
      });
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
    <div className="flex flex-col bg-white h-screen">
      <div className="w-full h-24 flex items-center justify-between px-6 bg-[#FAFAFA]">
        <div>
          <h1 className="font-hedvig text-2xl md:text-2xl">New Verso</h1>
        </div>
        <div>
          <button
            onClick={() => props.onClickBack()}
            className="h-10 w-10 rounded-md bg-white border border-gray-200"
          >
            <div className="flex items-center justify-center p-2">
              <XMarkIcon />
            </div>
          </button>
        </div>
      </div>

      <div className={`w-full h-full flex flex-col justify-between py-4 px-6 `}>
        <div className="w-full flex flex-col">
          <div className="">
            <label className="w-full flex flex-col">
              <p className="text-sm py-2 font-medium text-gray-500">Title</p>
              <input
                type="text"
                name="title"
                value={title}
                placeholder="Name your verso..."
                className="h-12 pl-4 text-base border-2 border-gray-200 placeholder:text-sm font-sans rounded-md font-light focus:outline-none"
                onChange={(e) => setTitle(e.target.value)}
              ></input>
            </label>
          </div>

          <div className="">
            <label className="w-full flex flex-col mt-4">
              <p className="text-sm py-2 font-medium text-gray-500">
                Description
              </p>

              <textarea
                name="description"
                value={description}
                placeholder="Describe your verso..."
                className="h-28 p-4 border-2 border-gray-200 rounded-md font-sans text-base placeholder:text-sm font-light focus:outline-none"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </label>
          </div>

          <div className={``}>
            <label className="h-full w-full flex flex-col mt-4">
              <p className="text-sm py-2 font-medium text-gray-500">Media *</p>
              <div
                className={`h-16 cursor-pointer border-2 ${
                  imageError ? "border-rose-300" : "border-gray-200"
                } rounded-md focus:outline-none`}
              >
                {!fileName ? (
                  <div className="h-full flex flex-row items-center px-2">
                    <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                      <div className="h-6 w-6">
                        <PhotoIcon color="#666666" />
                      </div>
                    </div>
                    <div className="flex flex-col pl-6 py-2">
                      <p className="text-sm font-medium">
                        Click to upload media (3mb max.)
                      </p>
                      <p className="text-xs text-gray-500">3MB limit</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-row items-center justify-center px-2">
                    <p className="text-zinc-800 text-xs font-semibold py-6">
                      {fileName}
                    </p>
                  </div>
                )}
              </div>
              {imageError ? (
                <p className="text-rose-700 text-xs mt-2 mb-4">{imageError}</p>
              ) : null}
              <input
                id="dropzone-file"
                type="file"
                accept=".jpg, .jpge, .png"
                className="opacity-0 z-40"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
        <div className="">
          <FormButton
            text={"Mint Verso"}
            loading={loading}
            onClick={handleMintverso}
          />
        </div>
      </div>
    </div>
  );
}
