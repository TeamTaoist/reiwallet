import TokenHeader from "../header/tokenHeader";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { useWeb3 } from "../../store/contracts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    &:focus {
      outline: none;
    }
  }
`;

export default function CurrencyList() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { exchangeList },
  } = useWeb3();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setList(exchangeList);
  }, [exchangeList]);

  const handleInput = (e) => {
    setKeyword(e.target.value);
    const arr = exchangeList.filter(
      (item) => item.symbol.indexOf(keyword) > -1,
    );
    setList(arr ?? []);
  };

  const handleSelect = (item) => {
    dispatch({ type: "SET_CURRENCY", payload: item });
    navigate("/swap");
  };

  return (
    <BoxOuter>
      <TokenHeader title={t("popup.Swap")} />
      <Box>
        <SearchBox>
          <Search size={20} />
          <input
            type="text"
            placeholder="Type a currency or ticker"
            value={keyword}
            onChange={(e) => handleInput(e)}
          />
        </SearchBox>
        <div className="titleHeader">{t("swap.popular")}</div>
        <UlBox>
          {list.map((item, index) => (
            <dl key={index} onClick={() => handleSelect(item)}>
              <dt>
                <img
                  src={`https://stealthex-icon.caboroca.xyz/image/${item.symbol}/${item.network}`}
                  alt=""
                />
              </dt>
              <dd>
                <FlexLine>
                  <div className="title">{item.symbol}</div>
                  <div className="tag">{item.network}</div>
                </FlexLine>
                {/*<div className="tips">USD Coin</div>*/}
              </dd>
            </dl>
          ))}
        </UlBox>
      </Box>
    </BoxOuter>
  );
}
