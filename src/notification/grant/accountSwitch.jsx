import styled from "styled-components";
import CheckNor from "../../assets/images/Check01.png";
import CheckAct from "../../assets/images/Check02.png";
import PublicJs from "../../utils/publicJS";
import useAccountAddress from "../../hooks/useAccountAddress";
import Avatar from "../../popup/svg/avatar/avatar";

const BgBox = styled.div`
  position: absolute;
  height: 346px;
  z-index: 99999;
  top: 80px;
  width: 90%;
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px #ededed;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// const TitleBox = styled.div`
//   font-size: 18px;
//   font-weight: 500;
//   color: #34332E;
//   line-height: 20px;
//   height: 62px;
//   display: flex;
//   align-items: center;
//   padding: 0 20px;
//   flex-shrink: 0;
// `

const ContentBox = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  ul {
    padding-bottom: 100px;
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 68px;
    &:hover {
      background: #f1fcf1;
    }
  }
  .decr {
    width: 24px;
  }
`;
const AccountBox = styled.div`
  flex-grow: 1;
  margin: 0 6px;
  display: flex;
  align-items: center;
  .avatar {
    width: 24px;
    border-radius: 24px;
    margin-right: 12px;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #34332e;
    line-height: 20px;
  }
  .balance {
    font-size: 14px;
    font-weight: 500;
    color: #a6acbd;
    line-height: 20px;
  }
  .tagBox {
    margin-left: 10px;
    background: #00ff9d;
    color: #000;
    border-radius: 8px;
    font-size: 10px;
    padding: 0 10px;
  }
`;

export default function AccountSwitch({ currentAccount, handleCurrent }) {
  const { accountList } = useAccountAddress();

  return (
    <BgBox>
      <ContentBox>
        <ul>
          {accountList?.map((item, index) => (
            <li key={index} onClick={() => handleCurrent(index)}>
              <img
                src={currentAccount === index ? CheckAct : CheckNor}
                alt=""
                className="decr"
              />
              <AccountBox>
                <div className="avatar">
                  <Avatar size={24} address={item.address} />
                </div>
                <div>
                  <div className="medium-font">
                    {item.name}
                    {item.type === "import" && (
                      <span className="tagBox">{item.type}</span>
                    )}
                  </div>
                  <div className="balance medium-font">
                    {PublicJs.addressToShow(item.address)}
                  </div>
                </div>
              </AccountBox>
            </li>
          ))}
        </ul>
      </ContentBox>
    </BgBox>
  );
}
