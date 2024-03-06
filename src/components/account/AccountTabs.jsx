import styled from "styled-components";
import {useState} from "react";
import Assets from "./assets";
import Activities from "./Activities";
import {useTranslation} from "react-i18next";

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
    const [list] = useState([t('popup.account.Assets'),t('popup.account.Activities')])
    const [ current, setCurrent] = useState(0);

    const chooseCurrent = (index) =>{
        setCurrent(index);
    }

    return <div>
        <Tabs>
            {
                list.map((item,index)=>(<div key={index} className={current===index ? "active item" :"item"} onClick={()=>chooseCurrent(index)}>
                    <span>{item}</span>
                    <div className="line" />
                </div>))
            }
        </Tabs>
        <Content>
            {
                current === 0 && <Assets />
            }
            {
                current === 1 && <Activities />
            }
        </Content>
    </div>
}