"use client";
import React, { useState, useEffect, useContext } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { UserDropDown } from "../main/UserDropDown";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserContext } from "@/context/user-context";

export function Header() {
  const router = useRouter();
  const { login } = usePrivy();
  const user = useContext(UserContext);
  const [top, setTop] = useState(true);

  // Simple use effect to handle scroll behavior
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  if (router?.pathname === "/[handle]/[collectionId]/[tokenId]") {
    return null;
  }

  const wallet = user?.wallet;
  const profile = user?.profile;

  return (
    <div
      className={`z-10 w-full h-20 lg:h-16 fixed top-0 flex flex-row items-center bg-white ${
        !top && "shadow-md"
      }`}
    >
      <div className="w-1/3 md:w-1/5 flex flex-col justify-end lg:justify-center pl-5 lg:pl-6">
        <div className="py-4 lg:p-4 z-50 overflow-visible cursor-pointer">
          <h4 className="text-xl lg:text-xl font-lora tracking-wide leading-none text-zinc-800 ">
            verso
            <span className="text-teal-400 lg:text-2xl">.</span>
          </h4>
        </div>
      </div>
      <div className="w-1/3 md:w-3/5"></div>
      <div className="w-1/3 md:w-1/5 pr-5 lg:pr-10 flex flex-col items-end justify-center">
        <div>
          {wallet ? (
            <div className="flex flex-row justify-center">
              {profile ? (
                <div className="flex items-center justify-center h-10 w-32 bg-black rounded-md hover:opacity-80 mr-6">
                  <Link href={`/create`}>
                    <p className="cursor-pointer text-sm text-white font-light tracking-wide ">
                      New collection
                    </p>
                  </Link>
                </div>
              ) : null}
              <UserDropDown profile={profile ?? undefined} wallet={wallet} />
            </div>
          ) : (
            <div className="h-10 w-20 rounded-sm bg-zinc-800 flex items-center justify-center hover:opacity-90">
              <button
                className="h-full w-full text-sm font-light"
                onClick={login}
              >
                <p className="text-white font-light text-sm">Connect</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
