import styled from "styled-components";

const UlBox = styled.ul`
    &:after {
        content: '';
        display: block;
        clear: both;
    }
    li{
        float: left;
        width: 24%;
        margin-right: 1%;
        margin-bottom: 5px;
        position: relative;
        cursor: pointer;
        border: 1px solid #eee;
        border-radius: 10px;
        &:nth-child(4n){
            margin-right: 0;
        }
        .photo{

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
            .innerImg{
                position: absolute;
                width: 100%;
                height: 100%;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                        object-position: center;
                        object-fit: cover;
                }
            }
        }
        .title{
            position: absolute;
            white-space: nowrap;
            left:10px;
            bottom:5px;
            font-size: 10px;
            width: calc(100% - 20px);
            color: #fff;
            background: rgba(0,0,0,0.8);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`
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
        .inner{
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
            //text-overflow: ellipsis;
            //display: -webkit-box;
            //-webkit-box-orient: vertical;
            //-webkit-line-clamp: 4;
            //overflow: hidden;
        }
    
`

const ClusterUl = styled(UlBox)`
    padding-bottom:5px;
    margin-bottom:10px;
`

const Cls = styled(TextBox)`
    .inner{
        padding: 0;
    }
    .cluster{
        width: 100%;
        font-size: 12px;
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 10px;
        text-transform: uppercase;
    }
    .titleBtm{
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 5px;
        background: #00FF9D;
        width: 100%;
        height: 50%;
        text-align: center;
        font-size: 12px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 1.4em;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`

export default function DobClusterList({cList,toCluster}){
    return <>
        {
            !!cList?.length &&   <ClusterUl>
                {
                    cList?.map((item,index)=>(<li key={`cluster_${index}`} className="item"  onClick={() => toCluster(item)}>
                        <Cls>
                            <div className="aspect"/>
                            <div className="content">
                                <div className="inner">
                                    <div className="cluster">{item?.cluster?.name}</div>
                                    {/*<div className="titleBtm">*/}
                                    {/*    {item?.cluster?.name}*/}
                                    {/*</div>*/}

                                </div>
                            </div>
                        </Cls>
                    </li>))
                }
            </ClusterUl>
        }</>
}
