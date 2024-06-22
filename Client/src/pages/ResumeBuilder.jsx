import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from '../components/Modal';
import styled from "styled-components";
import { useState } from "react";
import Template1 from '../components/resumeTemplate/Template1'
import Template2 from '../components/resumeTemplate/Template2'
import { useEffect } from "react";

const ButtonCustom= styled.button`
    width: fit-content;
    padding: 1.2rem 1.8rem;
    background-color: #72cace;
    border: 1px solid #223d3e;
    border-radius: 1rem;

    font-size: 1.8rem;
    font-weight: 500;
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    
    &:hover{
        transform: scale(1.01);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.204);
    }

    @media (max-width: 450px) {
        padding: 0.6rem 1.2rem;
    }
`;

const Wrapper= styled.div`
    margin: 0 auto;
    padding: 8rem 1rem 5rem 1rem;
    display: flex;
    flex-direction :column ;
    align-items: center;
    gap: 3rem;
    position: relative;
`;
const CardWrapper= styled.div`
    display: flex;
    gap: 8rem;
    justify-content: center;

    @media (max-width: 800px){
        gap: 3rem
    }

    @media (max-width: 550px){
        flex-direction: column;
    }
`;
const Card= styled.div`
    border-radius: 1rem;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    width: 32rem;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    &:hover{
        transform: translateY(-10px);
        &>div>img{
            transform: scale(1.02);
            transition: all 0.5s;
        }
    }
    transition: all 0.5s;
    cursor: pointer;

    @media (max-width: 700px){
        width: 25rem;
    }
    @media (max-width: 550px){
        width: 28rem;
    }
    @media (max-width: 300px){
        width: 25rem;
    }
`;

const CardImgDiv= styled.div`
    width: 100%;
    border-radius: 1rem;
    overflow: hidden;
    border-bottom: 3px solid #de587c;
    position: relative;

    &::before{
        content:"Demo";
        position: absolute;
        top: 20px;
        right: -50px;
        background-color: #60b9bb;
        color: #000;
        padding: 0.4rem 1rem;
        border-radius: 1rem;
        font-size: 1.5rem;
        z-index: 9999;
        width: 20rem;
        text-align: center;
        transform: rotate(37.5deg);
    }
`;

const SpanDiv= styled.div`
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: uppercase;
    color: #de587c;
    font-weight: 500;

    @media (max-width: 700px){
        &>span{
            font-size: 1.2rem
        }
    }
`;

const TemplateWrapper= styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
`;

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

function ResumeBuilder() {
    
    const navigate= useNavigate();
    const {authUser} = useAuthContext();
    const [template, setTemplate] = useState(null);
    const fileName= (authUser) ? authUser.user.username.split(' ').join('_')+"_Resume" : "No_User";

    useEffect(() => {
        document.title = fileName; // Set your desired title here
    }, []); // Empty dependency array ensures this effect runs only once

    if(!authUser){
        return (
            <Modal isOpen={true}>
                <>
                    <h3>User logged out, Please login again</h3>
                    <ButtonCustom style={{margin: "0 auto", marginTop: "2rem", color: "black"}} onClick={()=>navigate('/login')}>Login</ButtonCustom>
                </>
            </Modal>
        );
    }

    const handleDownload= (tNo) => {
        setTemplate(tNo);
        setTimeout(() => {
            window.print();
            setTemplate(null); // Hide Template1 after printing
        }, 500); // Adjust delay as needed (e.g., 300ms)
    }

    return (
        <>
            {!template &&
                <Wrapper>
                    <GoBackImg style={{left: "3rem"}} src='/goBack.svg' onClick={()=>navigate(-1)} alt="back" />
                    <GoBackImg style={{right: "3rem", width: "3.7rem"}} src='/home.svg' onClick={()=>navigate('/')} alt="home" />
                    <span style={{color: "#de587c", textAlign: "center", padding: "0 1rem"}}>Click on any of the below template to download resume</span>
                    <CardWrapper>
                        <Card onClick={() => handleDownload(1)}>
                            <CardImgDiv><img src='/template1.webp' alt='template1'></img></CardImgDiv>
                            <SpanDiv>
                                <span>Single Column Resume</span>
                                <span>Suitable for freshers</span>
                                <span>Prefer single page resume</span>
                            </SpanDiv>
                        </Card>
                        <Card onClick={() => handleDownload(2)}>
                            <CardImgDiv><img src='/template2.webp' alt='template2'></img></CardImgDiv>
                            <SpanDiv>
                                <span>Double Column Resume</span>
                                <span>Suitable for experienced</span>
                                <span>Prefer single page resume</span>
                            </SpanDiv>
                        </Card>
                    </CardWrapper>
                </Wrapper>
            }
            {(template===1) && <TemplateWrapper><Template1 email={authUser.user.email} name={authUser.user.username}/></TemplateWrapper>}
            {(template===2) && <TemplateWrapper><Template2 email={authUser.user.email} name={authUser.user.username}/></TemplateWrapper>}
        </>
        
    );
}

export default ResumeBuilder;
