import styled from "styled-components";
import ErrorImg from "../../assets/images/error_image.svg";
import { useEffect, useState } from "react";
import { decodeDOB } from "@taoist-labs/dob-decoder";
import useNetwork from "../../hooks/useNetwork";

const UlBox = styled.ul`
  &:after {
    content: "";
    display: block;
    clear: both;
  }
  li {
    float: left;
    width: 24%;
    margin-right: 1%;
    margin-bottom: 5px;
    position: relative;
    cursor: pointer;
    border: 1px solid #eee;
    border-radius: 10px;
    &:nth-child(4n) {
      margin-right: 0;
    }
    .photo {
      display: flex !important;
      overflow: hidden;
      .aspect {
        padding-bottom: 100%;
        height: 0;
        flex-grow: 1 !important;
      }
      .content {
        width: 100%;
        margin-left: -100% !important;
        max-width: 100% !important;
        flex-grow: 1 !important;
        position: relative;
      }
      .innerImg {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          max-width: 100%;
          max-height: 100%;
          border-radius: 8px;
          object-position: center;
          object-fit: cover;
        }
      }
    }
    .title {
      position: absolute;
      white-space: nowrap;
      left: 10px;
      bottom: 5px;
      font-size: 10px;
      width: calc(100% - 20px);
      color: #fff;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
const TextBox = styled.div`
  display: flex !important;
  overflow: hidden;
  .aspect {
    padding-bottom: 100%;
    height: 0;
    flex-grow: 1 !important;
  }
  .content {
    width: 100%;
    margin-left: -100% !important;
    max-width: 100% !important;
    flex-grow: 1 !important;
    position: relative;
  }
  .inner {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f8;
    font-size: 10px;
    font-family: "AvenirNext-Medium";
    font-weight: 500;
    line-height: 17px;
    box-sizing: border-box;
    padding: 10px;

    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }
`;
export default function ClusterListDOB({ loading, list, toDetail, current }) {
  const [sList, setSList] = useState([]);
  const { network } = useNetwork();

  useEffect(() => {
    formatList();
  }, [list]);

  const formatList = async () => {
    if (list === "") return;
    setSList([]);

    let arr = [];

    for (let i = 0; i < list.length; i++) {
      let item = list[i];

      const itemDobId = item.output.type.args;
      try {
        const asset = await decodeDOB(
          itemDobId,
          network === "testnet",
          item.output_data,
          current === 0 ? "spore" : "did",
        );
        arr.push({ ...item, asset });

        setSList([...arr]);
      } catch (e) {
        console.log("Get dob info failed", e);
      }
    }
  };

  return (
    <>
      {!loading && (
        <UlBox>
          {sList?.map((item, index) => (
            <li
              key={index}
              onClick={() => toDetail(item, current === 0 ? "spore" : "did")}
            >
              {item.asset?.contentType?.indexOf("image") > -1 && (
                <div className="photo">
                  <div className="aspect" />
                  <div className="content">
                    <div className="innerImg">
                      <img
                        src={item.asset.data ? item.asset.data : ErrorImg}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              )}
              {item.asset?.contentType?.indexOf("text") > -1 && (
                <TextBox>
                  <div className="aspect" />
                  <div className="content">
                    <div className="inner">{item.asset.data}</div>
                  </div>
                </TextBox>
              )}
              {item.asset?.contentType?.indexOf("json") > -1 && (
                <div className="photo">
                  <div className="aspect" />
                  <div className="content">
                    <div className="innerImg">
                      <img src={item.asset.data.url} alt="" />
                    </div>
                  </div>
                </div>
              )}

              {(item.asset?.contentType?.indexOf("dob/0") > -1 ||
                item.asset?.contentType?.indexOf("DID") > -1) && (
                <div className="photo">
                  <div className="aspect" />
                  <div className="content">
                    <div className="innerImg">
                      <img src={item.asset.data.imgUrl} alt="" />
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </UlBox>
      )}
    </>
  );
}
