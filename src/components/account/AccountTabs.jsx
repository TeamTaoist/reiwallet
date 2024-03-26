import styled from "styled-components";
import {useEffect, useState} from "react";
import Assets from "./assets";
import Activities from "./Activities";
import {useTranslation} from "react-i18next";
import {useNavigate, useSearchParams} from "react-router-dom";
import SendDetail from "../token/sendDetail";

const Tabs = styled.div`
    display: flex;
    .item{
      width: 33.333%;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: #A6ACBD;
      line-height: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .line{
        border-bottom: 4px solid #fff;
        border-radius: 4px;
        padding-top: 5px;
        width: 20px;
      }
      &.active{
        color: #000000;
        .line{
          border-bottom: 4px solid #000;
        }
      }
    }
`
const Content = styled.div`
`

export default function AccountTabs(){
    const { t } = useTranslation();
    // const [list] = useState([t('popup.account.Activities'),t('popup.account.Assets'),"SUDT"])
    const [list] = useState([t('popup.account.Activities')])
    const [ current, setCurrent] = useState(0);
    const [searchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const navigate = useNavigate();
    const [show,setShow] = useState(false);

    useEffect(() => {
        let newTab = tab ??0;
        setCurrent(Number(newTab))

    }, [tab]);

    const chooseCurrent = (index) =>{
        navigate(`?tab=${index}`)
    }

    // const handleShow = () =>{
    //     setShow(true)
    // }
    // const handleShowClose = () =>{
    //     setShow(false)
    // }

    return <div>

        {/*{*/}
        {/*    show && <SendDetail handleShow={handleShow} handleShowClose={handleShowClose} />*/}
        {/*}*/}
        <Tabs>
            {
                list.map((item,index)=>(<div key={index} className={current===index ? "active item" :"item"} onClick={()=>chooseCurrent(index)}>
                    <span>{item}</span>
                    <div className="line" />
                </div>))
            }
        </Tabs>
        <Content>
            {/*{*/}
            {/*    current === 1 && <Assets />*/}
            {/*}*/}
            {
                current === 0 && <Activities />
            }
        </Content>
    </div>
}
