import styled from "styled-components";
import GettingStarted from "../components/GettingStarted";


const StyledAbout= styled.div`
    display: grid;
    grid-template-columns: 1fr 1.8fr;
    padding: 0rem 3rem 4rem 3rem;
    @media (max-width: 1100px) {
        padding: 3rem 8rem 5rem 8rem;
        grid-template-columns: 1fr;
        background-image: url('/bg-about.webp');
        background-size: cover;
        background-repeat: no-repeat;
    }
    @media (max-width: 550px) {
        padding: 3rem 6rem 5rem 6rem;
    }
    @media (max-width: 450px) {
        padding: 3rem 3rem 5rem 3rem;
    }
`;
const AboutText= styled.div`
    align-self: center;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    font-size: 1.8rem;

    @media (max-width: 1450px) {
        padding: 2rem 0;
    }
`;
const Bold= styled.span`
    font-weight: 500;
    color: #447b7d;
    font-size: 1.8rem;
`;
const Img= styled.img`
    width: 95%;
    align-self: center;

    @media (max-width: 1200px) {
        transform: scale(1.1);
    }
    @media (max-width: 1100px) {
        display: none;
    }
`;


function About() {
    const svgMarkup = `
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" overflow="auto" shape-rendering="auto" fill="#f1fafa">
        <defs>
        <path id="wavepath" d="M 0 2000 0 500 Q 97 363 194 500 t 194 0 194 0 194 0 194 0 194 0 194 0 194 0  v1000 z" />
   <path id="motionpath" d="M -388 0 0 0" /> 
        </defs>
        <g >
        <use xlink:href="#wavepath" y="30" fill="#d5eaeb">
        <animateMotion
            dur="5s"
            repeatCount="indefinite">
            <mpath xlink:href="#motionpath" />
        </animateMotion>
        </use>
        </g>
        </svg>
    `;

    return (
        <>
            <StyledAbout>
                <Img src='/page-asset/main-with-bg.webp' alt="man facing computer"></Img>
                <AboutText>
                    <div>
                        Tired of swiping through hundreds of generic resumes or job postings that never quite hit the mark? We get it. The traditional job search is broken. That's why we created <Bold>CareerSwipe</Bold>, the matchmaking app for careers.
                    </div>
                    <div>
                        <span style={{borderBottom: "2px solid #e16989", color:"#e16989", fontWeight: "500"}}>Here's how it works:</span>
                        <ul style={{ padding: "0.8rem 0rem" }}>
                            <li><Bold> &#8226; Candidates:</Bold> Create a profile showcasing your skills, experience, and career goals.</li>
                            <li><Bold> &#8226; Recruiters:</Bold> List your open positions and what you're looking for in a perfect hire.</li>
                        </ul>
                        
                        Just like your favorite dating app, swipe right on profiles that pique your interest. If there's a mutual match, we'll connect you for a seamless interview process.
                    </div>
                    <div>
                        <span style={{borderBottom: "2px solid #e16989", color:"#e16989", fontWeight: "500"}}>It's a win-win:</span>
                        <ul style={{ padding: "0.8rem 0rem" }}>
                            <li><Bold> &#8226; Candidates:</Bold> Land your dream job faster by connecting with recruiters actively seeking your skillset.</li>
                            <li><Bold> &#8226; Recruiters:</Bold> Find qualified candidates who are genuinely excited about the opportunity.</li>
                        </ul>
                    </div>
                    <div>
                        Stop wasting time, start making meaningful connections. Find your perfect career match on <Bold>CareerSwipe!</Bold>
                    </div>
                </AboutText>
                <div style={{gridRow: "2/3", gridColumn: "1/-1", margin: "0rem auto", textAlign: "center"}}><GettingStarted page="about"/></div>
            </StyledAbout>
            <div style={{height: "10rem"}} dangerouslySetInnerHTML={{ __html: svgMarkup }} />
        </>
    );
}

export default About;
