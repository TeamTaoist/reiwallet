import NavHeader from "../../header/navHeader";
import CreateHeader from "./createHeader";
import {useTranslation} from "react-i18next";
import styled from "styled-components";
import Button from "../../button/button";
import {useNavigate} from "react-router-dom";
import { useState} from "react";
import ClearImg from "../../../assets/images/clear.png";

const Box = styled.div`
    display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100vh;
  position: relative;
`

const MainBox = styled.div`
    padding: 0 20px;
  flex-grow: 1;

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

const BtmBox = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 20px;
  width: 100%;
  
  background: #FFFFFF;
  box-shadow: 0px -1px 5px 0px rgba(0, 0, 0, 0.05);
`

// const SelectedBox = styled.div`
//     display: flex;
//     flex-wrap: wrap;
//     margin: 20px 0 100px -20px;
//
//     span{
//       margin:0 0 10px 20px ;
//       padding: 6px 10px;
//       background: #FCFEFA;
//       border-radius: 10px;
//       border: 1px solid #D2D5E1;
//       cursor: pointer;
//       &.active{
//         background: #00FF9D;
//         border-radius: 10px;
//         border: 1px solid #00FF9D;
//       }
//     }
//
// `

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

export default function Step3(){
    const { t } = useTranslation();
    const navigate = useNavigate();

    // const [list,setList] = useState([]);
    const [selectedArr,SetSelectedArr] = useState([]);
    // const [activeArr, setActiveArr] = useState([]);
    // const [disabled , setDisabled] = useState(true);
    // const next = () =>{
    //     navigate('/social');
    // }
    const clear = () =>{
        // setActiveArr([]);
        SetSelectedArr([]);
    }
    // const chooseSelect = (selected,index)=>{
    //     let arr= [...selectedArr];
    //     arr.push(selected);
    //     SetSelectedArr(arr);
    //
    //     let actArr = [...activeArr];
    //     actArr[index] = true;
    //     setActiveArr(actArr)
    // }

    const submit = async() =>{

        navigate('/success');
    }

    return  <Box>
        <NavHeader title={t('popup.createTitle')} />
        <CreateHeader title={t('popup.step3.subTitle')} step="3/3" tips={t('popup.step3.tips')} />
        <MainBox>
            <div>
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
                {/*<SelectedBox>*/}
                {/*    {*/}
                {/*        list.map((item,index)=>(<span className={activeArr[index]?'active':''} key={`list_${index}`} onClick={()=>chooseSelect(item,index)}>{item}</span>))*/}
                {/*    }*/}
                {/*</SelectedBox>*/}
            </div>
        </MainBox>
        <BtmBox>
            <Button fullWidth primary onClick={()=>submit()} >{t('popup.step3.Confirm')}</Button>
        </BtmBox>
    </Box>
}
