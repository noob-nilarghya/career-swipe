import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import GettingStarted from "../components/GettingStarted";
import About from "./About";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;


const StyledLanding= styled.div`
    display: grid;
    grid-template-columns: 1.5fr 2fr;
    padding: 6rem 10rem 5rem 10rem;
    animation: ${fadeIn} 1.3s ease-in-out;

    @media (max-width: 1250px){
        padding: 6rem 8rem 5rem 8rem;
    }
    @media (max-width: 900px){
        padding: 6rem 5rem 5rem 5rem;
    }
    @media (max-width: 800px){
        grid-template-columns: 1fr;
        justify-items: center;
    }
    @media (max-width: 350px){
        padding: 4rem 3rem 5rem 3rem;
    }
`;
const LandingText= styled.div`
    align-self: center;
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    animation: ${fadeIn} 1.8s ease-in-out;

    @media (max-width: 1200px){
        width: 90%;
    }
    @media (max-width: 800px){
        padding: 0 3rem;
        align-items: center;
        text-align: center;
    }
    @media (max-width: 650px){
        padding: 0;
    }
`;
const H1= styled.h1`
    font-weight: 400;
    font-size: 5.2rem;
    line-height: 7rem;
    @media (max-width: 1250px){
        font-size: 4.8rem;
        line-height: 6rem;
    }
    @media (max-width: 1050px){
        font-size: 4.2rem;
        line-height: 5.5rem;
    }
    @media (max-width: 950px){
        font-size: 3.6rem;
        line-height: 4.5rem;
    }
    @media (max-width: 850px){
        font-size: 3.2rem;
        line-height: 4rem;
    }
`;
const P= styled.p`
    font-size: 1.8rem;
    @media (max-width: 850px){
        font-size: 1.7rem;
    }
`;
const DivImg=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    justify-self: end;
    width: 100%;
    animation: ${slideIn} 1.8s ease-in-out;
`;
const Img= styled.img`
    width: 100%;
    @media (max-width: 1200px){
        transform: scale(1.05);
    }
    @media (max-width: 1200px){
        transform: scale(1.2);
    }
    @media (max-width: 800px){
        transform: scale(1);
        width: 80%;
    }
    @media (max-width: 600px){
        width: 90%;
    }
    @media (max-width: 450px){
        width: 100%;
    }
`;
const A= styled.a`
    color: #e16989;
    width: fit-content;
    font-weight: 500;
    margin-left: 0.6rem;
    border-bottom: 2px solid #e16989;
    transition: transform 0.3s;

    &:hover{
        transform: scale(1.02);
    }
`;



function Landing() {

    const navigate= useNavigate();

    return (
        <>
        <StyledLanding>
            <LandingText>
                <H1>Bridging Skills to Match Right Opportunities</H1>
                <P>Connecting Talent, Empowering Futures: Where Candidates and Recruiters Swipe Right for Success</P>
                <GettingStarted page="landing"/>
                <A onClick={()=> navigate('/about')}>Learn More</A> 
            </LandingText>
            <DivImg>
                <Img src='/page-asset/about-with-bg.svg' alt='persons facing laptop' />
            </DivImg>
        </StyledLanding>
        <About />
        </>
    );
}

export default Landing;
