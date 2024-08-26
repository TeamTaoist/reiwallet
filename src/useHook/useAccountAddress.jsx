import { useEffect, useState } from "react";
import useNetwork from "./useNetwork";
import useWalletList from "./useWalletList";
import useCurrentAccount from "./useCurrentAccount";

export default function useAccountAddress() {
  const [accountList, setAccountList] = useState([]);
  const [currentAccountInfo, setCurrentAccountInfo] = useState("");
  const { network } = useNetwork();
  const { walletList } = useWalletList();

  const { currentAccount } = useCurrentAccount();

  useEffect(() => {
    if (!walletList?.length) return;
    get_Address_list();
  }, [network, walletList]);

  useEffect(() => {
    if (!walletList?.length || currentAccount === "") return;
    get_Address();
  }, [network, currentAccount, walletList]);

  const get_Address = (index) => {
    const current = walletList[index ?? currentAccount];
    current.address =
      network === "mainnet"
        ? current.account.address_main
        : current.account.address_test;
    setCurrentAccountInfo({ ...current });
    return current.address;
  };

  const get_Address_list = () => {
    let addrList = [...walletList];
    addrList.map((item) => {
      item.address =
        network === "mainnet"
          ? item.account.address_main
          : item.account.address_test;
      return item;
    });

    setAccountList(addrList);
  };

  return { accountList, currentAccountInfo, get_Address };
}
