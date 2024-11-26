import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const BoxOuter = styled.div`
  display: flex;
  flex-direction: column;
  background: #f9fafa;
  min-height: 100vh;
`;

const Box = styled.div`
  padding: 10px 20px;
  .titleHeader {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

const UlBox = styled.div`
  dl {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  dt {
    img {
      width: 28px;
      height: 28px;
    }
  }
  .tips {
    opacity: 0.5;
  }
`;

const FlexLine = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .title {
    font-size: 14px;
    font-weight: bold;
    color: #000000;
  }
  .tag {
    background: rgb(145, 165, 240);
    padding: 2px;
    color: #fff;
    font-size: 10px;
    line-height: 1em;
    border-radius: 2px;
  }
`;

const SearchBox = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
  input {
    background: transparent;
    border: none;
  }
`;

export default function CurrencyList() {
  const { t } = useTranslation();

  return (
    <BoxOuter>
      <TokenHeader title={t("popup.Swap")} />
      <Box>
        <SearchBox>
          <Search size={20} />
          <input type="text" placeholder="0" />
        </SearchBox>
        <div className="titleHeader">Popular currencies</div>
        <UlBox>
          {[...Array(40)].map((item, index) => (
            <dl key={index}>
              <dt>
                <img
                  src="https://images.stealthex.io/coins-color/629e3ad0de5ae50018e77e5f-ckb_c.svg"
                  alt=""
                />
              </dt>
              <dd>
                <FlexLine>
                  <div className="title">USDT</div>
                  <div className="tag">ETH</div>
                </FlexLine>
                <div className="tips">USD Coin</div>
              </dd>
            </dl>
          ))}
        </UlBox>
      </Box>
    </BoxOuter>
  );
}
