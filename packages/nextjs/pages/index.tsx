import { useEffect, useState } from "react";
import Head from "next/head";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { Address, Balance, EtherInput } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
  useScaffoldEventHistory,
} from "~~/hooks/scaffold-eth";

type BuilderData = {
  cap: BigNumber;
  unlockedAmount: BigNumber;
  builderAddress: string;
};

const Home: NextPage = () => {
  const { address } = useAccount();
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const { data: streamContract } = useDeployedContractInfo("YourContract");

  const [builderList, setBuilderList] = useState<string[]>([]);

  const { data: owner } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "owner",
  });

  const { data: allBuildersData, isLoading: isLoadingBuilderData } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "allBuildersData",
    args: [builderList],
  });

  const { writeAsync: doWithdraw } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "streamWithdraw",
    args: [ethers.utils.parseEther(amount || "0"), reason],
  });

  const { data: withdrawEvents, isLoading: isLoadingWithdrawEvents } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "Withdraw",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
    blockData: true,
  });

  const { data: addBuilderEvents, isLoading: isLoadingBuilderEvents } = useScaffoldEventHistory({
    contractName: "YourContract",
    eventName: "AddBuilder",
    fromBlock: Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0,
  });

  useEffect(() => {
    if (addBuilderEvents && addBuilderEvents.length > 0) {
      const fetchedBuilderList = addBuilderEvents.map((event: any) => event.args.to);
      // remove duplicates
      const uniqueBuilderList = [...new Set(fetchedBuilderList)];
      setBuilderList(uniqueBuilderList);
    }
  }, [addBuilderEvents]);

  const sortedWithdrawEvents = withdrawEvents?.sort((a: any, b: any) => b.block.number - a.block.number);

  const amIAStreamedBuilder = allBuildersData?.some(
    (builderData: BuilderData) => builderData.builderAddress === address,
  );
  return (
    <>
      <Head>
        <title>Play-Full Futures | BuidlGuidl, Kernel, RADAR</title>
        <meta
          name="description"
          content="We're running an experiment to retroactively fund more playful, open-source futures. This page gathers the best researchers and buidlers to co-create in ways that are truly good for the various publics in which we all participate."
        />
        <meta property="og:title" content="Play-Full Futures" />
        <meta
          property="og:description"
          content="We're running an experiment to retroactively fund more playful, open-source futures. This page gathers the best researchers and buidlers to co-create in ways that are truly good for the various publics in which we all participate."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:image" content="https://play-full.buidlguidl.com/thumbnail.png" />
        <meta property="twitter:image" content="https://play-full.buidlguidl.com/thumbnail.png" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10 mb-20">
        <p className="font-bold text-center text-4xl w-full leading-6 primary-heading p-2">Welcome</p>
        <div className="max-w-[40rem] m-auto w-[90%] mb-10 text-primary-content">
          <p>
            We're running an experiment to retroactively fund more playful, open-source futures. This page gathers the
            best researchers and buidlers to co-create goods for the various publics in which we all participate.
          </p>
          <p>Players can submit monthly projects, claim grant streams, and showcase their work.</p>
          <p>
            "And once those limits are understood
            <br />
            To understand that limitations no longer exist.
            <br />
            Earth could be fair. And you and I must be free
            <br />
            Not to save the world in a glorious crusade
            <br />
            Not to kill ourselves with a nameless gnawing pain
            <br />
            But to practice with all the skill of our being
            <br />
            The art of making possible." <br />
            <br /> -{" "}
            <a
              href="https://www.kernel.community/en/learn/module-6/serenity"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              Nancy Scheibner
            </a>
          </p>
        </div>

        <h2 className="mt-5 mb-10 font-bold text-2xl primary-heading p-2 w-full text-center">Contributions</h2>
        <div className="m-auto max-w-[40rem] w-[90%] mb-10 text-primary-content">
          {isLoadingWithdrawEvents ? (
            <div className="my-10 text-center">
              <div className="text-5xl animate-bounce mb-2">👾</div>
              <div className="text-lg loading-dots">Loading...</div>
            </div>
          ) : (
            <>
              {sortedWithdrawEvents?.map((event: any) => {
                return (
                  <div
                    className="flex flex-col gap-1 mb-6"
                    key={`${event.log.address}_${event.log.blockNumber}`}
                    data-test={`${event.log.address}_${event.log.blockNumber}`}
                  >
                    <div>
                      <Address address={event.args.to} />
                    </div>
                    <div>
                      <strong>{new Date(event.block.timestamp * 1000).toISOString().split("T")[0]}</strong>
                    </div>
                    <div>
                      <strong className="underline">Ξ {ethers.utils.formatEther(event.args.amount)}</strong>:{" "}
                      <span className="break-words">{event.args.reason}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <h2 className="mt-5 mb-10 font-bold text-2xl primary-heading p-2 w-full text-center">Buidler ETH Streams</h2>
        <div className="m-auto max-w-[40rem] w-[90%] mb-10 text-primary-content">
          {isLoadingBuilderData || isLoadingBuilderEvents ? (
            <div className="my-10 text-center">
              <div className="text-5xl animate-bounce mb-2">👾</div>
              <div className="text-lg loading-dots">Loading...</div>
            </div>
          ) : (
            <>
              {allBuildersData?.map((builderData: BuilderData) => {
                if (builderData.cap.isZero()) return;
                const cap = ethers.utils.formatEther(builderData.cap || 0);
                const unlocked = ethers.utils.formatEther(builderData.unlockedAmount || 0);
                const percentage = Math.floor((parseFloat(unlocked) / parseFloat(cap)) * 100);
                return (
                  <div
                    className="pb-8 flex flex-col items-center gap-2 md:gap-4 md:flex-row"
                    key={builderData.builderAddress}
                  >
                    <div className="md:w-1/2 flex justify-end">
                      <label
                        htmlFor="withdraw-events-modal"
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedAddress(builderData.builderAddress);
                          setFilteredEvents(
                            withdrawEvents?.filter((event: any) => event.args.to === builderData.builderAddress) || [],
                          );
                        }}
                      >
                        <Address address={builderData.builderAddress} disableAddressLink={true} />
                      </label>
                    </div>
                    <div className="flex flex-col items-center">
                      <div>
                        Ξ {parseFloat(unlocked).toFixed(4)} / {cap}
                      </div>
                      <progress
                        className="progress w-56 progress-primary bg-white"
                        value={percentage}
                        max="100"
                      ></progress>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="my-6 flex flex-col items-center">
          <p className="font-bold mb-2 primary-heading">Stream Contract</p>
          <Address address={streamContract?.address} />
          <p className="font-bold mb-2 primary-heading">Stream Balance</p>
          <Balance address={streamContract?.address} className="text-3xl" />
          {address && amIAStreamedBuilder && (
            <div className="mt-6">
              <label
                htmlFor="withdraw-modal"
                className="btn btn-primary btn-sm px-2 rounded-full font-normal space-x-2 normal-case"
              >
                <BanknotesIcon className="h-4 w-4" />
                <span>Withdraw</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="my-6 flex flex-col items-center">
        <p className="font-bold mb-2 primary-heading">Owner</p>
        <Address address={owner} />
      </div>

      <input type="checkbox" id="withdraw-modal" className="modal-toggle" />
      <label htmlFor="withdraw-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-8">Withdraw from your stream</h3>
          <label htmlFor="withdraw-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <div className="flex flex-col gap-6 items-center">
              <input
                type="text"
                className="input input-ghost focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 w-full font-medium placeholder:text-accent/50 text-gray-400 border-2 border-base-300 bg-base-200 rounded-full text-accent"
                placeholder="Reason for withdrawing and link to github plz"
                value={reason}
                onChange={event => setReason(event.target.value)}
              />
              <EtherInput value={amount} onChange={value => setAmount(value)} />
              <button className="btn btn-primary btn-sm" onClick={doWithdraw}>
                Withdraw
              </button>
            </div>
          </div>
        </label>
      </label>
      <input type="checkbox" id="withdraw-events-modal" className="modal-toggle" />
      <label htmlFor="withdraw-events-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          {/* dummy input to capture event onclick on modal box */}
          <input className="h-0 w-0 absolute top-0 left-0" />
          <h3 className="text-xl font-bold mb-8">
            <p className="mb-1">Contributions</p>
            <Address address={selectedAddress} />
          </h3>
          <label htmlFor="withdraw-events-modal" className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3">
            ✕
          </label>
          <div className="space-y-3">
            <ul>
              {filteredEvents.length > 0 ? (
                <div className="flex flex-col">
                  {filteredEvents.map(event => (
                    <div key={event.log.transactionHash} className="flex flex-col">
                      <div>
                        <span className="font-bold">Date: </span>
                        {new Date(event.block.timestamp * 1000).toISOString().split("T")[0]}
                      </div>
                      <div>
                        <span className="font-bold">Amount: </span>Ξ{" "}
                        {ethers.utils.formatEther(event.args.amount.toString())}
                      </div>
                      <div>{event.args.reason}</div>
                      <hr className="my-8" />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No contributions</p>
              )}
            </ul>
          </div>
        </label>
      </label>
    </>
  );
};

export default Home;
