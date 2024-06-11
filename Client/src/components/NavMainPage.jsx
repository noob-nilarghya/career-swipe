import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {logoutService} from '../services/apiUser';
import toast from 'react-hot-toast';
import { useAuthContext } from "../context/AuthContext";
import { useRoleContext } from "../context/RoleContext";
import { useState } from "react";

const StyledNav= styled.nav`
    width: 100vw;
    max-width: 100vw;
    z-index: 9999;
    grid-column: 1/-1;
    padding: 1rem 5rem 2rem 5rem;
    display: flex;
    justify-content: space-between;
    background-color: ${(props)=>(props.type==='feed') ? "#f1fafa" : "#fff"};
    position: sticky;
    top: 0;

    @media (max-width: 900px) {
        flex-direction: column;
        align-items: center;
    }

    @media (max-width: 750px) {
        width: 100vw;
        max-width: 60rem;
        margin: 0px auto;
    }
`;
const Img= styled.img`
    width: 18rem;
    cursor: pointer;
    @media (max-width: 1200px) {
        margin-left: 3rem;
    }
    @media (max-width: 900px) {
        padding-top: 1rem;
        margin-left: 0;
    }
    @media (max-width: 450px) {
        width: 16rem;
    }
    @media (max-width: 300px) {
        padding-top: 1rem;
        width: 15rem;
    }
`;
const MessageIcon= styled.div`
    cursor: pointer;
    display: none;
    position: absolute;
    top: 2rem;
    left: 2rem;
    width: 3rem;
    height: 3rem;
    background-image: url('/message-icon.svg');
    background-size: cover;
    background-repeat: no-repeat;

    @media (max-width: 1200px) {
        display: block;
    }
`;
const Hamburger= styled.div`
    cursor: pointer;
    display: none;
    position: absolute;
    top: 2rem;
    right: 3rem;
    width: 2.5rem;
    height: 2.5rem;
    background-image: ${(props) => (props.menuOpen ? "url('/close.svg')" : "url('/hamburger.svg')")};
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 0.3s ease;

    @media (max-width: 900px) {
        display: block;
    }
`;
const Links= styled.ul`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    font-weight: 500;
    margin-top: 1rem;
    
    transform: translateY(${(props) => (props.menuOpen ? "0" : "-10px")});
    transition: all 0.3s ease;

    &>li{
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        transition: all 0.3s;
        cursor: pointer;
    }
    &>li:hover{
        background-color: #cdeef0;
        color: #002b36;
        transform: translateY(-2px);
    }

    @media (max-width: 900px) {
        margin-top: 0rem;
        opacity: ${(props) => (props.menuOpen ? 1 : 0)};
        visibility: ${(props) => (props.menuOpen ? "visible" : "hidden")};
        padding: 0.5rem 0 0.5rem 0;
        width: 100vw;
        background-color: ${(props)=>(props.type==='feed') ? "#f1fafa" : "#fff"};
        border-radius: 0 0 1.2rem 1.2rem;
    }
    @media (max-width: 600px) {
        gap: 2rem;
    }
    @media (max-width: 480px) {
        padding-top: 1rem;
        flex-direction: column;
        gap: 1rem;
        &>li{
            text-align: center;
            width: 100%;
            padding: 0.5rem 0;
            gap: 1rem;
        }
    }
`;
const ImgUser= styled.img`
    border-radius: 2rem;
    width: 40px;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    @media (max-width: 480px) {
        display: none;
    }
`;


function NavMainPage({type}) {
    const navigate= useNavigate();
    const {authUser, setAuthUser}= useAuthContext();
    const {roleUser, setRoleUser} = useRoleContext();
    const SERVER_BASE_URL= import.meta.env.VITE_SERVER_URL;
    const [menuOpen, setMenuOpen]= useState(false);

    const handleMsgClick= function(){
        navigate('/message-small-screen');
    }

    const {isFetching, error, refetch} = useQuery({
        queryKey: ['user-login'],
        queryFn: () => logoutService(),
        enabled: false, // Initialize useQuery with enabled set to false
        refetchOnWindowFocus: false, // Disable automatic refetch on window focus
    });

    const handleLogout= function(){
        refetch({ force: true, cancelRefetch: true, throwOnError: true, reset: true });
        if (error) {
            toast.error(error.message);
            return;
        } 
        toast.success('Logging Out...');
        setTimeout(()=>{
            localStorage.removeItem('role-user');
            setRoleUser((val) => null);
            localStorage.removeItem('auth-user');
            setAuthUser((val) => null);
            
            navigate('/login');
        }, 1500);
    }

    return (
        <StyledNav type={type}>
            <MessageIcon onClick={handleMsgClick}/>
            <Img src='/logo-assets/logo-text.webp' alt='logo' onClick={()=>navigate('/')}></Img>
            <Hamburger onClick={()=>setMenuOpen((val)=>!val)} menuOpen={menuOpen}/>
            <Links menuOpen={menuOpen} type={type}>
                <li onClick={()=>setMenuOpen((val)=>!val)}> <NavLink to="/feed" style={({ isActive }) => {return isActive ? { color: "#407173" } : {};}}>Feed</NavLink> </li>
                <li onClick={()=>setMenuOpen((val)=>!val)}> <NavLink to="/edit-account" style={({ isActive }) => {return isActive ? { color: "#407173" } : {};}}>Edit Account</NavLink></li>
                <li onClick={()=>setMenuOpen((val)=>!val)}> <NavLink to={(authUser.user.role === 'candidate') ? `/edit-candidate` : `/edit-recruiter`} style={({ isActive }) => {return isActive ? { color: "#407173" } : {};}}>Edit Bio</NavLink></li>
                <li onClick={handleLogout}>Logout</li>
                {authUser && 
                    <ImgUser src={`${SERVER_BASE_URL}/${authUser.user.photo}`} alt='userImg' onError={`this.onerror=null; this.src=${SERVER_BASE_URL}/default.jpeg;`}></ImgUser>
                }
            </Links>
        </StyledNav>
    );
}

export default NavMainPage;
