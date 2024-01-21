import { useCallback, useState } from "react";
import { NextPage } from "next";

import { Drawer } from "@/components/common/Drawer";
import { UpdateProfileDetailsForm } from "@/components/forms/UpdateProfileDetails";
import { CreateCollectionForm } from "@/components/forms/CreateCollectionForm";
import { CollectionsCarousel } from "@/components/main/CollectionsCarousel";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/router";

const Profile: NextPage = () => {
  let [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false);
  let [openCreateDrawer, setOpenCreateDrawer] = useState<boolean>(false);
  const user = useUser();
  const router = useRouter();

  const handle = router.query.handle as string;

  const handleOpenUpdateDrawer = useCallback(() => {
    // Check if user exists
    if (user?.profile?.metadata.handle == handle) {
      setOpenUpdateDrawer(true);
    }
  }, [user, handle]);

  return (
    <main className="h-screen w-screen flex flex-row px-24">
      {user?.wallet && user?.profile ? (
        <Drawer isOpen={openUpdateDrawer} setIsOpen={setOpenUpdateDrawer}>
          <UpdateProfileDetailsForm
            side
            wallet={user.wallet}
            profile={user.profile}
            onUpdateComplete={() => setOpenUpdateDrawer(false)}
          />
        </Drawer>
      ) : null}

      <Drawer isOpen={openCreateDrawer} setIsOpen={setOpenCreateDrawer}>
        <CreateCollectionForm handleClose={() => setOpenCreateDrawer(false)} />
      </Drawer>
      <div className="w-1/4 h-full flex flex-col justify-center md:pr-4">
        {user?.profile?.metadata.image ? (
          <img
            onClick={handleOpenUpdateDrawer}
            className="h-28 w-28 rounded-full object-cover cursor-pointer"
            src={user?.profile?.metadata.image}
          />
        ) : (
          <div
            onClick={handleOpenUpdateDrawer}
            className="h-28 w-28 rounded-full cursor-pointer bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
          />
        )}
        <div className="w-full md:mt-8">
          <p className="text-2xl font-hedvig text-black">
            {user?.profile?.metadata.name}
          </p>
          <p className="font-hedvig text-xl font-light text-black opacity-60">
            @{user?.profile?.metadata.handle}.verso
          </p>

          <p className="md:mt-4 text-3xl text-black font-hedvig">
            {user?.profile?.metadata.description}
          </p>
        </div>
      </div>
      <div className="w-3/4 h-full md:py-44 md:pl-24 overflow-y-scroll no-scrollbar">
        <CollectionsCarousel
          openDrawer={() => setOpenCreateDrawer(true)}
          handle={handle}
          collections={[]}
          onClick={() => null}
        />
      </div>
    </main>
  );
};

export default Profile;
