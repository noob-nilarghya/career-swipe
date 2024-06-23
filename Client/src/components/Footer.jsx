import { NavLink } from "react-router-dom";
import styled, {keyframes} from "styled-components";

const fadeInOut = keyframes`
  0%{
    opacity: 0;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
`;

const StyledFooter= styled.div`
    background-color: #d5eaeb;
    padding: 4rem 10rem;
    display: grid;
    grid-template-columns: 1.5fr 2fr 2fr;
    justify-content: space-around;
    justify-items: center;
    align-items: center; 

    &>span{
        grid-column: 1/-1;
        text-align: center;
        margin-top: 2rem;
        color: #de587c;
        padding: 0.2rem 1.2rem;
        background: rgba(255, 255, 255, 0.2);
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 2rem;
        animation: ${fadeInOut} 3s infinite;

        display: none; /* Hide it initially, himmat nhi hua, sharam a rha tha :( */
    }

    @media (max-width: 1250px){
        padding: 0 8rem 4rem 8rem;
    }
    @media (max-width: 900px){
        padding: 0 6rem 4rem 6rem;
    }
    @media (max-width: 800px){
        grid-template-columns: 1fr 1fr 1fr;
        padding: 0 4rem 4rem 4rem;
    }
    @media (max-width: 650px){
        grid-template-columns: 2fr 1.5fr 1.5fr;
    }
    @media (max-width: 550px){
        padding: 0 5rem 3rem 5rem;
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 430px){
        padding: 0 3rem 3rem 3rem;
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
            <span>Help us keep this website live by making a small contribution <a style={{textDecoration: "underline"}} href='/pay-here' alt='pay-here'>here</a>. Thank you for your support!</span>
        </StyledFooter>
    );
}

export default Footer;
