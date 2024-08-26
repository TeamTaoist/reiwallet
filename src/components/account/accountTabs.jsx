import styled from "styled-components";
import { useEffect, useState } from "react";
import Activities from "./activities";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import Dob from "../DOB/dob";
import XUDT from "../xudt/xudt";

const Tabs = styled.div`
  display: flex;
  .item {
    width: 33.3333%;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #a6acbd;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .line {
      border-bottom: 4px solid #fff;
      border-radius: 4px;
      padding-top: 5px;
      width: 20px;
    }
    &.active {
      color: #000000;
      .line {
        border-bottom: 4px solid #000;
      }
    }
  }
  .none {
    display: none;
  }
`;
const Content = styled.div``;

export default function AccountTabs() {
  const { t } = useTranslation();
  const [list] = useState([
    {
      value: 3,
      name: "XUDT",
    },
    {
      value: 1,
      name: "DOB",
    },
    {
      value: 0,
      name: t("popup.account.Activities"),
    },

    // {
    //     value:2,
    //     name:"SUDT"
    // },
  ]);
  const [current, setCurrent] = useState(3);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const navigate = useNavigate();
  // const [show,setShow] = useState(false);

  useEffect(() => {
    let newTab = tab ?? 3;
    setCurrent(Number(newTab));
  }, [tab]);

  const chooseCurrent = (index) => {
    navigate(`?tab=${index}`);
  };

  // const handleShow = () =>{
  //     setShow(true)
  // }
  // const handleShowClose = () =>{
  //     setShow(false)
  // }

  return (
    <div>
      {/*{*/}
      {/*    show && <SendDetail handleShow={handleShow} handleShowClose={handleShowClose} />*/}
      {/*}*/}
      <Tabs>
        {list.map((item, index) => (
          <div
            key={index}
            className={current === item.value ? "active item" : "item"}
            onClick={() => chooseCurrent(item.value)}
          >
            <span>{item.name}</span>
            <div className="line" />
          </div>
        ))}
      </Tabs>
      <Content>
        {current === 0 && <Activities />}
        {current === 1 && <Dob />}
        {current === 3 && <XUDT />}
      </Content>
    </div>
  );
}
