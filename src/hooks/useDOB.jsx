import { useEffect, useState } from "react";
import useMessage from "./useMessage";
import useAccountAddress from "./useAccountAddress";

export default function useDOB(current) {
  const { currentAccountInfo } = useAccountAddress();
  const [loading, setLoading] = useState(false);
  const [loadingCL, setLoadingCL] = useState(false);
  const [list, setList] = useState("");
  const [didList, setDidList] = useState("");
  const [clusterList, setClusterList] = useState("");

  const handleEvent = (message) => {
    const { type } = message;
    switch (type) {
      case "get_dob_success":
        {
          setList(message.data?.objects ?? []);
          setLoading(false);
        }
        break;
      case "get_did_success":
        {
          setDidList(message.data?.objects ?? []);
          setLoading(false);
        }
        break;
      case "get_cluster_success":
        {
          setClusterList(message.data?.objects ?? []);
          setLoadingCL(false);
        }
        break;
    }
  };

  const { sendMsg } = useMessage(handleEvent, []);

  useEffect(() => {
    if (!currentAccountInfo) return;

    setLoading(true);
    setList([]);
    if (current === 0) {
      toBackground();
    } else {
      toDIDBackground();
    }
  }, [currentAccountInfo, current]);

  useEffect(() => {
    if (!currentAccountInfo) return;
    setLoadingCL(true);
    clusterToBackground();
  }, [currentAccountInfo]);

  const toDIDBackground = () => {
    let obj = {
      method: "get_did",
      currentAccountInfo,
    };
    setList([]);
    sendMsg(obj);
  };

  const toBackground = () => {
    let obj = {
      method: "get_dob",
      currentAccountInfo,
    };
    setList([]);
    sendMsg(obj);
  };
  const clusterToBackground = () => {
    let obj = {
      method: "get_cluster",
      currentAccountInfo,
    };

    sendMsg(obj);
  };
  return { list, didList, loading, clusterList, loadingCL };
}
