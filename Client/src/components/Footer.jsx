import { NavLink } from "react-router-dom";
import styled from "styled-components";

const StyledFooter= styled.div`
    background-color: #d5eaeb;
    padding: 4rem 10rem;
    display: grid;
    grid-template-columns: 1.5fr 2fr 2fr;
    justify-content: space-around;
    justify-items: center;
    align-items: center;

    @media (max-width: 1250px){
        padding: 4rem 8rem;
    }
    @media (max-width: 900px){
        padding: 4rem 6rem;
    }
    @media (max-width: 800px){
        grid-template-columns: 1fr 1fr 1fr;
        padding: 4rem;
    }
    @media (max-width: 650px){
        grid-template-columns: 2fr 1.5fr 1.5fr;
    }
    @media (max-width: 550px){
        padding: 3rem 5rem;
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 430px){
        padding: 3rem;
    }
    @media (max-width: 400px){
        grid-template-columns: 1.5fr 1fr;
    }
`;
const FooterCol= styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    height: 100%;
`;
const LastCol= styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    height: 100%;
    @media (max-width: 550px){
        padding-top: 2rem;
        flex-direction: row;
        gap: 2rem;
        grid-column: 1/-1;
    }
`;
const Li= styled.li`
    width: fit-content;
    transition: all 0.3s;
    &:hover{
        border-bottom: 1.5px solid #1a1a1a;
        transform: translateX(2px);
    }
`
const A= styled.a`
    padding-right: 2rem;
    &>img{
        width: 2.4rem;
        transition: transform 0.3s;
    }
    &>img:hover{
        transform: translateY(-3px);
    }
`;


function Footer() {
    return (
        <StyledFooter>
            <FooterCol>
                <img src='/logo-assets/logo.webp' style={{width: "3.5rem"}} alt='logo' />
                <p style={{fontWeight: 500}}>Swipe, Match, Interview</p>
                <p>&copy; CareerSwipe, 2024. All right reserved</p>
            </FooterCol>
            <FooterCol style={{justifySelf: "center"}}>
                <p style={{width: "fit-content", borderBottom: "1.6px solid black", fontWeight: "500"}}>Resources</p>
                <ul>
                    <Li> <NavLink to="/register">Create Account</NavLink> </Li>
                    <Li> <NavLink to="/login">Login</NavLink> </Li>
                    <Li> <NavLink to="/about">About Us</NavLink> </Li>
                </ul>
            </FooterCol>
            <LastCol style={{alignItems: "center"}}>
                <div>
                    <A href='https://www.facebook.com/profile.php?id=100005255746624' target="_blank"> <img src='/socials-assets/fb.svg' alt='facebook' /></A>
                    <A href='https://www.instagram.com/nilarghya.roy/' target="_blank"> <img src='/socials-assets/insta.svg' alt='instagram' /></A>
                    <A style={{paddingRight: 0}} href='/' target="_blank"> <img src='/socials-assets/x.svg' alt='x' /></A>
                </div>
                <div><a style={{display: "flex", gap: "1rem", color: "#e16989", fontWeight: "500", justifyContent: "center"}} href="mailto:roynilarghya@gmail.com?subject=MealMate%20||%20Query:%20"><img style={{width: "3rem"}} src='/socials-assets/email.svg' alt="emial" /> Contact Us</a></div>
            </LastCol>
        </StyledFooter>
    );
}

export default Footer;
