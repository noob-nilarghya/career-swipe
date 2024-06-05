import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const flash = keyframes`
    0%{
        opacity: 1;
        transform: translate(45px);
    }
    100%{
        opacity: 0;
        transform: translate(0);
    }
`;

const StyledButton = styled.button`
    width: 16rem;
    padding: 1.2rem 1.8rem;
    background-color: #7ad1d5;
    border: 0px solid #223d3e;
    border-radius: 1.2rem;

    font-size: 1.8rem;
    font-weight: 500;
    user-select: none;
    cursor: pointer;
    transition: all 500ms linear;
    position: relative;

    &::before{
        content: "";
        width: 100%;
        height: 100%;
        background-color: #7ad1d5;
        position: absolute;
        border-radius: inherit;
        z-index: -1;
        top: 0;
        left: 0;
        transition: all 500ms ease-in-out;
        opacity: 0;
        animation: ${flash} 500ms ease-in-out;
        transform: scaleX(1.2) scaleY(1.5);
    }
    &:hover::before{
        opacity: 1;
        transform: scaleX(1) scaleY(1);
    }

    @media (max-width: 1000px){
        padding: 0.8rem 1.2rem;
    }
    @media (max-width: 450px){
        width: 14rem;
        padding: 0.8rem 0.8rem;
        /* font-size: 1.4rem; */
    }
`;

function Button({ children, url }) {
    const navigate = useNavigate();
    return (
        <StyledButton onClick={() => navigate(url)}>
            {children}
        </StyledButton>
    );
}

export default Button;
