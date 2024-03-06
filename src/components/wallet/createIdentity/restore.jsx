import DashboardLayout from "../../dashboard/layout";
import {useNavigate} from "react-router-dom";
import Button from "../../button/button";
import ContainerLayout,{ContainerTitle} from "../../dashboard/container_layout";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import TipImg from '../../../assets/images/create/tip.png';


const ContainerContentStyled = styled.div`
  .title{
    margin-right: 100px;
  }
`

const Box = styled.div`
  .inputBox{
    margin: 20px 0;
      min-height: 120px;
      textarea{
          padding: 20px 25px 20px;
          min-height: 120px;
          width: 100%;
          box-sizing: border-box;
          background: transparent;
          border: 0;
          &:focus{
              outline: none;
          }
      }
  }
  span{
    padding: 0 20px 10px 0;
  }
    
`
const AlertTips = styled.div`
    display: flex;
    align-items: flex-start;
  
      font-size: 14px;
      color: #242F57;
      line-height: 20px;
  padding-right: 10px;
    img{
      width: 24px;
      margin-right: 7px;
    }
`

export default function Restore(){
    const navigate = useNavigate();
    const { t } = useTranslation();
    const next = () =>{
        navigate('/social');
    }
    return <DashboardLayout>
        <ContainerLayout
            button={
                <Button primary fullWidth onClick={()=>next()}>Confirm</Button>
            }
        >
            <ContainerContentStyled>
                <ContainerTitle
                    title={t('install.create.restore.title')}
                    subTitle={t('install.create.restore.tips')}
                />
                <Box>
                    <div className="inputBox">
                        <textarea name=""  ></textarea>
                        {/*<span>personal</span>*/}
                        {/*<span>personal</span>*/}
                    </div>
                </Box>
                <AlertTips className="regular-font">
                    <img src={TipImg} alt=""/>
                    {t('install.create.restore.enterTips')}
                </AlertTips>
            </ContainerContentStyled>
        </ContainerLayout>
    </DashboardLayout>
}
