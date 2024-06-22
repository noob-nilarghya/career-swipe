import styled from "styled-components";

const StyledModal= styled.div`
    position: ${(props) => (props.purpose === 'chatInfo')  ? "" : "fixed"};
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(114, 185, 187, 0.5);
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.purpose === 'chatInfo')  ? "" : "centre"};
`;
const Wrapper= styled.div`
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    background: #caeec2;
    width: ${(props) => (props.purpose === 'chatInfo')  ? "100%" : ""};
    margin: auto;
    padding: 1.5rem 3rem;
    border: 3px solid #87a6a6;
    border-radius: 1rem;
    border-radius: ${(props) => (props.purpose === 'chatInfo')  ? "0" : "1 rem"};
    box-shadow: 2px solid black;
    text-align: center;

    &>h1,h2{
        color: #00501d;
    }
`;


function Modal({ isOpen, onClose, children, purpose }) {
    if (!isOpen) return null;
    return (
        <StyledModal onClick={onClose} purpose={purpose}>
            <Wrapper purpose={purpose}>
                {children}
            </Wrapper>
        </StyledModal>
    );
}

export default Modal;
