import React, { useState, useContext } from "react";
import { AppContext } from "@/context/context";
import { Spinner } from "../common/Spinner";
import { getFactoryContractInstance } from "@/lib/contracts";
import { AppActionTypes } from "@/reducers/appReducer";
import { uploadDataToArweave } from "@/resources";
import { NULL_ADDRESS } from "@/constants";
import { useRouter } from "next/router";
import { useUser } from "@/context/user-context";
import { createCollection } from "@/resources/collections/createCollection";

export function CreateCollectionForm(props: any) {
  // General state
  const router = useRouter();
  const { dispatch } = useContext(AppContext);
  const user = useUser();
  const [loading, setLoading] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Form errors
  const [titleError, setTitleError] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Run checks, upload media and create collection.
  const handleCreateCollection = async () => {
    // Set loading
    setLoading(true);
    // Run checks
    let error = handleErrors(title);

    if (error || !user?.wallet) {
      setLoading(false);
      return;
    }

    try {
      // Upload media
      let metadata = await uploadDataToArweave({
        title,
        description,
        creator: user?.profile?.metadata.handle,
        date: Date.now(),
      });
      const provider = await user.wallet.getEthersProvider();
      const signer = provider.getSigner();
      const factory = getFactoryContractInstance(signer);
      const tx = await factory.createCollection(
        title,
        0,
        1,
        NULL_ADDRESS,
        0,
        metadata.url
      );
      const receipt = await tx.wait();
      const address = receipt.logs[0].address;

      await createCollection(address, user.wallet.address);

      // Redirect and reset
      handleRedirect(address);
      resetInitialState();
      dispatch({
        type: AppActionTypes.Set_Toaster,
        payload: {
          toaster: {
            render: true,
            success: true,
            message: "Collection Created!",
          },
        },
      });
    } catch (e) {
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
    }
  };

  const handleRedirect = (collectionAddress: string) => {
    router.push(
      `/${user?.profile?.metadata.handle ?? ""}/${collectionAddress}`
    );
  };

  // Check errors before minting new colection
  const handleErrors = (title: string) => {
    let titleError;
    let imageError;
    if (title?.length == 0) {
      setTitleError("Title can't be empty");
      titleError = true;
    }
    if (titleError || imageError || error) {
      return true;
    } else return false;
  };

  const resetInitialState = () => {
    setTitle("");
    setDescription("");
    setLoading(false);
    setTitleError("");
    setError("");
  };

  const ready = title.length > 0;

  return (
    <div className="w-full h-full flex flex-col justify-center bg-white px-8">
      <h1 className="text-4xl mb-10 font-hedvig">Create collection</h1>
      <div className="w-full">
        <label className="w-full flex flex-col">
          <p className="text-base py-2 font-medium text-gray-500">Title*</p>
          <input
            type="text"
            name="title"
            value={title || ""}
            placeholder="Name your collection..."
            className="h-14 pl-4 text-lg border-2 border-gray-200 font-sans rounded-md font-light focus:outline-none"
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setTitleError("")}
          ></input>
          <div className="flex flex-row items-center mt-1">
            <p className="text-rose-700 text-xs font-semibold">{titleError}</p>
          </div>
        </label>
      </div>
      <div className="w-full mt-2">
        <label className="w-full flex flex-col">
          <p className="text-base py-2 font-medium text-gray-500">
            Description
          </p>
          <textarea
            name="description"
            value={description || ""}
            placeholder="Describe your new collection..."
            className="h-28 p-4 border-2 border-gray-200 rounded-md font-sans text-lg font-light focus:outline-none"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
      </div>

      <div className="mt-6">
        <button
          onClick={handleCreateCollection}
          disabled={ready ? false : true}
          className={`h-14 w-full rounded-md flex flex-col items-center justify-center
							${ready ? "cursor-pointer hover:opacity-90 bg-gray-800" : "bg-gray-100"} `}
        >
          {loading ? (
            <Spinner color="white" size="8" />
          ) : (
            <p
              className={`text-lg font-light tracking-wide ${
                ready ? "text-white" : "text-gray-500"
              } `}
            >
              Create collection
            </p>
          )}
        </button>
      </div>
      <p className="mt-4 text-center">
        <span className="font-bold">Note:</span> Verso makes it easy to create
        NFT collections following the ERC1155 standard. Proceeding, you will be
        creating a new NFT contract and you will be set as the owner.
      </p>
    </div>
  );
}
