import React from "react";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 p-4">
      <div className="flex-col items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="logo" className="h-16" />
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
      <div className="relative">
        <div className="hidden lg:block lg:fixed lg:-bottom-24 lg:-left-52 lg:z-0">
          <img alt="fingerprint" src="/lines.png" width={383} height={412} />
        </div>
        <div className="hidden lg:block lg:fixed lg:-bottom-12 lg:-right-52 lg:z-0">
          <img alt="fingerprint" src="/lines.png" width={442} height={476} />
        </div>
      </div>
    </div>
  );
};
