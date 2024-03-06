import DashboardLayout from "../../dashboard/layout";
import {useNavigate} from "react-router-dom";
import Button from "../../button/button";
import ContainerLayout,{ContainerTitle} from "../../dashboard/container_layout";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import ClearImg from '../../../assets/images/clear.png';

const ContainerContentStyled = styled.div`

`
const ContentBox = styled.div`
    .inputBox{
      margin: 20px 0;
      padding: 20px 25px 20px;
      min-height: 120px;

      &>div{
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
      }
    }
    span{
      padding: 0 20px 10px 0;
    }
`
const SelectedBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-left: -20px;
    span{
      margin:0 0 10px 20px ;
      padding: 6px 10px;
      background: #FCFEFA;
      border-radius: 10px;
      border: 1px solid #D2D5E1;
      cursor: pointer;
      &.active{
        background: #00FF9D;
        border-radius: 10px;
        border: 1px solid #00FF9D;
      }
    }
    
`
const ClearBox = styled.div`
    margin: -5px auto 15px;
    display: flex;
    align-items: center;
    span{
      font-size: 14px;
      font-weight: 500;
      color: #0054FF;
      line-height: 24px;
      padding: 0;
    }
    img{
      width: 24px;
      margin-left: 4px;
    }
`

export default function Confirmation(){
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [list,setList] = useState([]);
    const [selectedArr,SetSelectedArr] = useState([]);
    const [activeArr, setActiveArr] = useState([]);
    const [disabled , setDisabled] = useState(true);



    const next = () =>{
        window.close()

    }
    const chooseSelect = (selected,index,status)=>{
        if(status) return;
        const selectedLen = activeArr.filter(item=>item === true);
        if(selectedLen.length >= 12) return;

        let arr= [...selectedArr];
        arr.push(selected);
        SetSelectedArr(arr);

        let actArr = [...activeArr];
        actArr[index] = true;
        setActiveArr(actArr)
    }
    const clear = () =>{
        setActiveArr([]);
        SetSelectedArr([]);
    }

    return <DashboardLayout>
        <ContainerLayout
            button={
                // <Button primary fullWidth onClick={()=>next()} disabled={disabled}>{t('install.create.confirmation.Confirm')}</Button>
                <Button primary fullWidth onClick={()=>next()}>{t('install.create.confirmation.Confirm')}</Button>
            }
        >
            <ContainerContentStyled>
                <ContainerTitle
                    title={t('install.create.confirmation.title')}
                    subTitle={t('install.create.confirmation.tips')}
                />
                <ContentBox>
                    <div className="inputBox">
                        <div>
                            {
                                selectedArr.map((item,index)=>(<span key={`select_${index}`}>{item}</span>))
                            }
                        </div>
                    </div>
                    <ClearBox onClick={()=>clear()}>
                        <img src={ClearImg} alt=""/>
                        <span className="medium-font">Clear</span>
                    </ClearBox>
                    <SelectedBox>
                        {
                            list.map((item,index)=>(<span className={activeArr[index]?'active':''} key={`list_${index}`} onClick={()=>chooseSelect(item,index,activeArr[index])}>{item}</span>))
                        }
                    </SelectedBox>
                </ContentBox>
            </ContainerContentStyled>
        </ContainerLayout>
    </DashboardLayout>
}
