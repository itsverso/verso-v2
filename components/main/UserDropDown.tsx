"use client";
import React, { useState } from "react";
import { ConnectedWallet, usePrivy } from "@privy-io/react-auth";
import * as Icons from "../../resources/icons";
import { ethers } from "ethers";
import Link from "next/link";
import { Profile } from "@/resources/users/types";
import { useRef } from "react";
import { useEffect } from "react";

export function UserDropDown({
  wallet,
  profile,
}: {
  wallet: ConnectedWallet;
  profile?: Profile;
}) {
  const { logout } = usePrivy();
  const [visible, setIsVisible] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const balance = useRef("0.00");

  useEffect(() => {
    (async () => {
      if (!wallet.address) {
        return;
      }

      const provider = await wallet.getEthersProvider();
      const bigNumber = await provider.getBalance(wallet.address);
      const etherBalance = ethers.utils.formatEther(bigNumber);

      balance.current = etherBalance.slice(0, 5);
    })();
  }, [wallet.address]);

  // Copy address to clipboard
  const handleClickOnCopy = async () => {
    navigator.clipboard.writeText(wallet.address);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 1200);
  };

  return (
    <div>
      <button
        className="relative h-10 w-10 rounded-full flex items-center justify-center hover:opacity-80"
        onClick={() => setIsVisible(true)}
      >
        <div className="h-10 w-10 rounded-full">
          {profile?.metadata.image ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={profile?.metadata.image}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
          )}
        </div>
      </button>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`${
          visible ? "visible" : "hidden"
        } absolute right-10 w-72 bg-white flex flex-col text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4`}
        id="dropdown"
      >
        <Link href={`/${profile?.metadata.handle}`}>
          <div className="px-4 py-8 flex flex-col items-left hover:bg-neutral-100 cursor-pointer">
            <div className="flex flex-row items-center ">
              <div className="w-1/4 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-white">
                  {profile?.metadata.image ? (
                    <img
                      className="h-10 w-10 rounded-md object-cover"
                      src={profile?.metadata.image}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
                  )}
                </div>
              </div>
              <div className="px-4">
                <p className="text-xl font-bold leading-0">
                  {profile?.metadata.name}
                </p>
                <p className="text-sm italic font-light text-gray-700">
                  {profile?.metadata.handle}.verso
                </p>
              </div>
            </div>
          </div>
        </Link>
        <button
          onClick={handleClickOnCopy}
          className="flex flex-col justify-center items-left h-16 text-left hover:bg-neutral-100 px-4"
        >
          <p className="text-xs text-zinc-400">
            {hasCopied ? "Copied!" : "Wallet"}
          </p>
          <div className="flex flex-row">
            <p className="text-base font-extralight mr-4">
              {wallet.address.slice(0, 6) +
                "..." +
                wallet.address.slice(36, 42)}
            </p>
            {hasCopied ? <Icons.CopyFull size="4" /> : <Icons.Copy size="4" />}
          </div>
        </button>

        <div className="flex flex-col justify-center items-left h-16 text-left hover:bg-neutral-100 px-4">
          <p className="text-xs text-zinc-400">Balance</p>
          <div className="flex flex-row">
            <p className="text-base font-extralight mr-4">
              {balance.current + " ETH"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="h-14 text-left hover:opacity-90 bg-zinc-200 px-4"
        >
          <p className="text-sm">Log out</p>
        </button>
      </div>
    </div>
  );
}
