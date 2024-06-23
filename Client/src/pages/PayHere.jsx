import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const GoBackImg= styled.img`
    width: 3.5rem;
    position: absolute;
    top: 2rem;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover{
        transform: translateX(5px);
    }
`;

const Wrapper= styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
    height: 100vh;
    height: 100dvh;
    width: 100%;
    position: relative;

    &>span{
        color: #de587c;
        font-weight: 500;
        text-align: center;
        margin-bottom: 5rem;
    }
`;

function PayHere() {
    const navigate= useNavigate();

    return (
        <Wrapper>
            <GoBackImg style={{left: "4rem"}} src='/goBack.svg' onClick={()=>navigate(-1)} alt="back" />
            <GoBackImg style={{right: "4rem", width: "3.7rem"}} src='/home.svg' onClick={()=>navigate('/')} alt="home" />
            <GoBackImg style={{width: "20rem", paddingRight: "2rem", transform: "none"}} src='/logo-assets/logo-text.webp' alt="logo" />
            <img style={{width: "28rem"}} src='/qrcode.webp' alt='qrcode' />
            <span>Pay Here &#128070; || &#128591; Thank You</span>
        </Wrapper>
    );
}

export default PayHere;
