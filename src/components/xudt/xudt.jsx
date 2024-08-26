import Loading from "../loading/loading";
import useCurrentAccount from "../../useHook/useCurrentAccount";
import { useEffect, useState } from "react";
import useAccountAddress from "../../useHook/useAccountAddress";
import useXUDT from "../../useHook/useXUDT";
import styled from "styled-components";
import XudtItem from "./xudtItem";
import { unpackAmount } from "@ckb-lumos/common-scripts/lib/sudt";
import { BI } from "@ckb-lumos/lumos";

const Box = styled.div`
  padding: 15px 20px;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    border-radius: 14px;
    padding: 0 27px;
    cursor: pointer;
    background: #fafafa;
    margin-bottom: 10px;
    &:hover {
      background: #f1fcf1;
    }
    .flex {
      display: flex;
      align-content: center;
      justify-content: space-between;
      width: 100%;
    }
    span {
      font-size: 18px;
      font-weight: 500;
      color: #000000;
      line-height: 25px;
    }
    .flexInner {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .owner {
      background: #00ff9d;
      font-size: 10px;
      padding: 2px 4px;
      line-height: 10px;
      border-radius: 4px;
      height: 14px;
      box-sizing: border-box;
    }
  }
`;

// const SendBox = styled.div`
//     font-size: 16px;
//     font-family: "AvenirNext-Medium";
//     font-weight: bold;
//     color: #00A554;
// `

const LoadingBox = styled.div`
  margin-top: 30px;
`;

export default function XUDT() {
  const { list, loading } = useXUDT();
  const { currentAccount } = useCurrentAccount();
  const [sList, setSList] = useState([]);

  const { currentAccountInfo } = useAccountAddress();

  useEffect(() => {
    if (list === "" || !currentAccountInfo?.address) return;
    formatList();
  }, [list, currentAccount, currentAccountInfo]);

  const formatList = () => {
    setSList([]);
    let arr = [...list];
    let arrFormat = arr.map((item) => {
      item.amount = unpackAmount(item.output_data);
      return item;
    });

    const groupedData = arrFormat.reduce((acc, obj) => {
      const key = obj?.output?.type?.args;
      if (!acc[key]) {
        acc[key] = { category: key, sum: BI.from(0), ...obj };
      }
      acc[key].sum = acc[key].sum.add(obj.newAmount || obj.amount);

      return acc;
    }, {});
    const result = Object.values(groupedData);

    setSList(result);
  };

  return (
    <Box>
      {loading && (
        <LoadingBox>
          <Loading showBg={false} />
        </LoadingBox>
      )}
      <ul>
        {sList.map((item, index) => (
          <XudtItem item={item} key={index} />
        ))}
      </ul>
    </Box>
  );
}
