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
  const [walletHover, setWalletHover] = useState<boolean>(false);
  const [balanceHover, setBalanceHover] = useState<boolean>(false);

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
        onClick={() => setIsVisible(!visible)}
      >
        <div className="h-10 w-10 rounded-full">
          {profile?.metadata.image ? (
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={profile?.metadata.image}
            />
          ) : (
            <div className="h-10 w-10 rounded-full object-cover bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600"></div>
          )}
        </div>
      </button>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`${
          visible ? "visible" : "hidden"
        } absolute right-10 w-72 rounded-lg bg-white flex flex-col text-base z-50 list-none divide-y divide-gray-100 shadow-xl my-4`}
        id="dropdown"
      >
        <Link href={`/${profile?.metadata.handle}`}>
          <div className="px-2 py-4 flex flex-col items-left bg-zinc-50 hover:bg-zinc-100 cursor-pointer rounded-t-lg">
            <div className="flex flex-row items-center justify-between">
              <div className="px-4">
                <p className="text-lg font-medium leading-0">
                  {profile?.metadata.name}
                </p>
                <p className="text-base font-light text-zinc-500">
                  {profile?.metadata.handle}.verso
                </p>
              </div>
              <div className="w-1/4 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white">
                  {profile?.metadata.image ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={profile?.metadata.image}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full object-cover bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
        <button
          className="h-12 p-2"
          onClick={handleClickOnCopy}
          onMouseEnter={() => setWalletHover(true)}
          onMouseLeave={() => setWalletHover(false)}
        >
          <div className="flex flex-row items-center justify-between py-1 px-2 rounded-md hover:bg-gray-200">
            <p className="text-base">Wallet</p>

            <div className="flex flex-row items-center">
              <p
                className={`text-base  ${
                  walletHover ? "text-gray-900 mr-2" : "text-gray-500"
                }`}
              >
                {wallet.address.slice(0, 6) +
                  "..." +
                  wallet.address.slice(36, 42)}
              </p>
              <div>
                {walletHover ? (
                  <div>
                    {hasCopied ? (
                      <Icons.CopyFull size="4" />
                    ) : (
                      <Icons.Copy size="4" />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </button>

        <div
          className="h-12 p-2"
          onMouseEnter={() => setBalanceHover(true)}
          onMouseLeave={() => setBalanceHover(false)}
        >
          <div className="h-full flex flex-row items-center justify-between py-1 px-2 rounded-md hover:bg-gray-200">
            <p className="text-base">Balance</p>
            <div className="flex flex-row">
              <p
                className={`text-base  ${
                  balanceHover ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {balance.current + " ETH"}
              </p>
            </div>
          </div>
        </div>

        <button onClick={logout} className="h-12 p-2">
          <div className="h-full flex flex-row items-center py-1 px-2 rounded-md hover:bg-gray-200 ">
            <p className="text-base">Log out</p>
          </div>
        </button>
      </div>
    </div>
  );
}
