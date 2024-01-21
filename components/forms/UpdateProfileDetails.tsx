import React, { useState } from "react";
import * as Icons from "../../resources/icons";
import { FILE_SIZE } from "../../constants";
import { FormButton } from "../common/FormButton";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";
import { ConnectedWallet } from "@privy-io/react-auth";
import { Profile } from "@/resources/users/types";

type Props = {
  side?: boolean;
  wallet: ConnectedWallet;
  profile: Profile;
  onUpdateComplete: VoidFunction;
};

export function UpdateProfileDetailsForm(props: Props) {
  const [image, setImage] = useState<string | undefined>(
    props.profile.metadata.image
  );
  const [name, setName] = useState<string>(props.profile.metadata.name);
  const [imageError, setImageError] = useState<string | null>(null);
  const [description, setDescription] = useState<string>(
    props.profile.metadata.description ?? ""
  );
  const { error, loading, updateProfile } = useUpdateProfile();

  // Update profile metadata URL on registry.
  const handleUpdateProfile = async () => {
    await updateProfile(props.wallet, props.profile, {
      name,
      description,
      image,
    });

    props.onUpdateComplete();
  };

  // Handle name input
  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setName(e.target.value);
  };

  // Handle description
  const handleDescriptionInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setDescription(e.target.value);
  };

  // Convert file to base64 and set in state
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > FILE_SIZE) {
      setImageError("File too big. 3mb maximum.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageBase64 = reader.result as string;
      setImage(imageBase64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePic = () => {
    setImage("");
  };

  return (
    <div>
      <main>
        <div
          className={`overflow-hidden h-screen w-full flex flex-col pt-24 lg:pt-30 bg-white ${
            props.side ? "" : "md:px-64"
          }`}
        >
          <div className="flex flex-col px-6">
            <h1 className="font-lora font-light text-zinc-800 text-2xl md:text-3xl mb-4 sm:mb-8">
              Update Profile
            </h1>

            {error ? (
              <div className="w-full h-10 mb-4 flex flex-row">
                <div className="w-1/12 flex items-center justify-center">
                  <Icons.Warning color="#be123c" />
                </div>
                <div className="flex items-center">
                  <p className="text-rose700 text-sm font-normal">{error}</p>
                </div>
              </div>
            ) : null}

            <div className="relative mt-4 mb-5 flex flex-col">
              <div className="w-16 lg:w-20 h-16 lg:h-20 rounded-md flex flex-row bg-zinc-100">
                <label className="h-full w-full cursor-pointer">
                  {image ? (
                    <div>
                      <img
                        src={image}
                        className="w-16 lg:w-20 h-16 lg:h-20 rounded-md object-cover object-center"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".jpg, .jpge, .png"
                      name="add image"
                      className="opacity-0"
                      onChange={handleImageUpload}
                    />
                  )}
                </label>
              </div>
              {image ? (
                <div
                  onClick={handleRemovePic}
                  className="absolute top-0 left-20 w-10 flex flex-row items-center justify-center cursor-pointer"
                >
                  <Icons.circledX color="gray" />
                </div>
              ) : null}
            </div>
            <div className="w-full mb-4">
              {
                // Name
              }
              <label className="h-full w-full flex flex-col">
                <p className="text-sm font-lora text-accent6 py-2">Name</p>
                <input
                  type="text"
                  name="name"
                  value={name || ""}
                  className="h-12 px-4 font-light font-lora text-zinc-500 bg-zinc-100 text-sm focus:outline-none"
                  onChange={handleNameInput}
                ></input>
              </label>
            </div>

            <div className="w-full mb-4">
              {
                // Description
              }
              <label className="h-full w-full flex flex-col">
                <p className="text-sm font-lora text-accent6 py-2">
                  Description
                </p>
                <textarea
                  name="description"
                  value={description || ""}
                  className="h-24 p-4 font-light font-lora text-zinc-500 bg-zinc-100 text-sm focus:outline-none"
                  onChange={handleDescriptionInput}
                ></textarea>
              </label>
            </div>
            <div className="w-full mt-6">
              <FormButton
                text={"Update Profile"}
                loading={loading}
                onClick={handleUpdateProfile}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
