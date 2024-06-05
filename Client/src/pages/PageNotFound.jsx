import styled from "styled-components";
import Button from '../components/Button';

const StyledNotFound= styled.div`
    position: relative;
    height: 100vh;
`;
const ErrorDiv= styled.div`
    padding: 0 2rem;
    position: absolute;
    left: 50%;
    top:50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    margin-top: -2rem;
    max-width: 410px;
    width: 100%;
    text-align: center;
`;
const ErrH1= styled.div`
    height: 280px;
    position: relative;
    z-index: -1;

    @media (max-width: 767px) {
        height: 142px;
    }
`;
const H1= styled.h1`
    font-size: 230px;
    margin: 0px;
    font-weight: 900;
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    background: url('/page-asset/errbg.webp') no-repeat;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: cover;
    background-position: center;

    @media (max-width: 767px) {
        font-size: 112px;
    }
`;
const H2= styled.h2`
    padding-top: 3rem;
    color: #000;
    font-size: 24px;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 0;
`;
const P= styled.p`
    color: #000;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 20px;
    margin-top: 0px;
`;

function PageNotFound() {
    return (
        <StyledNotFound>
            <ErrorDiv>
                <ErrH1>
                    <H1>Oops!</H1>
                </ErrH1>
                <H2>404 - Page not found</H2>
                <P>The page you are looking for might have been removed or is temporarily unavailable.</P>
                <Button url='/'>Go To Home</Button>
            </ErrorDiv>
        </StyledNotFound>
    );
}

export default PageNotFound;
