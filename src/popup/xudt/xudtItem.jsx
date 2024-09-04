import PublicJS, {
  parseFixed,
  unSerializeTokenInfo,
} from "../../utils/publicJS";
import Next from "../../assets/images/into.png";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../../store/contracts";
import { config, Indexer } from "@ckb-lumos/lumos";
import useNetwork from "../../hooks/useNetwork";
import { useEffect, useState } from "react";
import useMessage from "../../hooks/useMessage";
import BtnLoading from "../loading/btnLoading";
import { formatUnit } from "@ckb-lumos/bi";
import { getUniqueTypeScript } from "@rgbpp-sdk/ckb";

const FlexRht = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-transform: uppercase;
`;

const FlexLft = styled.div`
  display: flex;
  align-content: center;
  font-size: 10px;
  gap: 5px;
  .token {
    opacity: 0.5;
  }
`;
export default function Xudt_item({ item }) {
  const navigate = useNavigate();
  const { dispatch } = useWeb3();
  const { network, networkInfo } = useNetwork();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (!network || !networkInfo) return;
    getDetail();
  }, [item, network, networkInfo]);

  const handleEvent = (message) => {
    const { type } = message;
    if (type === "get_transaction_success") {
      if (txHash === message.data.transaction.hash) {
        const {
          transaction: { outputs_data, outputs },
        } = message.data;
        const isMainnet = network === "mainnet";

        const utS = getUniqueTypeScript(isMainnet);
        const index = outputs?.findIndex(
          (itemInner) => itemInner?.type?.code_hash === utS.codeHash,
        );
        let rt =
          index !== -1 ? unSerializeTokenInfo(outputs_data[index]) : null;

        if (rt) {
          rt.newAmount = parseFixed(item.amount.toString(), rt.decimal);
        }
        setDetail(rt);
        setLoading(false);
      }
    }
  };

  const { sendMsg } = useMessage(handleEvent, [txHash]);

  const getDetail = async () => {
    if (network === "mainnet") {
      config.initializeConfig(config.predefined.LINA);
    } else {
      config.initializeConfig(config.predefined.AGGRON4);
    }

    const indexer = new Indexer(
      networkInfo.rpcUrl.indexer,
      networkInfo.rpcUrl.node,
    );

    let scriptObj = item?.output.type;
    // const hash = item.out_point.tx_hash;
    //
    const { args, code_hash, hash_type } = scriptObj;
    const txInfo = await indexer.getTransactions(
      {
        groupByTransaction: true,
        script: {
          codeHash: code_hash,
          args,
          hashType: hash_type,
        },
        scriptType: "type",
      },
      {
        order: "asc",
        sizeLimit: 1,
      },
    );
    if (!txInfo || !txInfo.objects[0]) return;
    const { txHash: tx } = txInfo.objects[0];
    toBackground(tx);
    setTxHash(tx);
  };

  const toBackground = (txHash) => {
    setLoading(true);
    let obj = {
      method: "get_transaction",
      txHash,
    };
    sendMsg(obj);
  };

  const toDetail = (item) => {
    dispatch({ type: "SET_XUDT_DETAIL", payload: { ...item, ...detail } });
    navigate("/xudtDetail");
  };

  return (
    <li onClick={() => toDetail(item)}>
      {!loading && (
        <div className="flex">
          <div>
            <div className="flexInner">
              <span className="medium-font"> {detail?.name} </span>
              {/*{*/}
              {/*    item?.argAddress === item.output.type.args && <div className="owner">owner</div>*/}
              {/*}*/}
            </div>
            <FlexLft>
              <div className="token">token</div>
              <div className="token">
                {PublicJS.addressToShow(item?.output?.type?.args)}
              </div>
            </FlexLft>
          </div>

          <FlexRht>
            {/*<SendBox>Send</SendBox>*/}
            <span>
              {item?.sum ? formatUnit(item?.sum?.toString(), "ckb") : 0}{" "}
              {detail?.symbol}
            </span>

            <img src={Next} alt="" />
          </FlexRht>
        </div>
      )}

      {loading && (
        <div className="innerLoading">
          <BtnLoading color="#00FF9D" />
        </div>
      )}
    </li>
  );
}
