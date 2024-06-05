import styled from "styled-components";
import Button from "./Button";

const GettingStartedWrapper= styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;
const Span= styled.span`
    width: fit-content;
    font-weight: 500;
    margin-left: 0.6rem;
    border-bottom: 2px solid #2e5152;
    font-size: 1.8rem;
    text-align: center;
    margin: ${props => (props.page==="about") ? "0 auto" : "0.6rem"};

    @media (max-width: 800px){
        margin: 0 auto;
        margin-top: 1rem;
    }
`;
const BtnWrapper= styled.div`
    display: flex;
    gap: 2rem;

    @media (max-width: 320px){
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
`;


function GettingStarted({page}) {
    return (
        <GettingStartedWrapper>
            <Span page={page}>Getting Started:</Span>
            <BtnWrapper>
                <Button url="/register">As Candidate</Button> 
                <Button url="/register">As Recruiter</Button> 
            </BtnWrapper>
        </GettingStartedWrapper>
    );
}

export default GettingStarted;
