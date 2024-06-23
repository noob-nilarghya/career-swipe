import styled, { keyframes } from "styled-components";
import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { rightSwipeService, leftSwipeService } from "../services/apiFeed";
import toast from 'react-hot-toast';
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const StyledFeed = styled.div`

    overflow: scroll;

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; 
    scrollbar-width: none; 

    border-right: 2px;
	border-left: 2px;
    border-image: linear-gradient(to bottom, #fff, #181818, #fff) 1 100%;
    border-style: solid;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-image: url('/feed-bg.jpg');
    background-size: cover;
    background-repeat: no-repeat;

    @media (max-width: 750px) {
        height: 88vh;
        width: 100%;
    }
`;
const CardWrapper = styled.div`
    position: relative;
    display: flex;
    width: 85%;
    height: 65vh;
    max-height: 45rem;
    
    overflow: visible;
    margin: 0 auto;
    justify-content: center;

    @media (max-width: 900px) {
        height: 58vh;
        max-height: 45rem;
    }
`;
const StyledTinderCard = styled(TinderCard)`
    position: absolute;
`;

const Icons = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    user-select: none;
    z-index: 1;
    gap: 0.5rem;
    
    &>img{
        width: 8vh;
        height: 8vh;
        max-width: 60px;
        max-height: 60px;
        border-radius: 50%;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.204);
        cursor: pointer;
        transition: all 0.3s;
    }
    &>img:nth-child(1) { margin-right: 2vh; }
    &>img:hover{
        transform: scale(1.05);
    }
`;
const A = styled.a`
    margin: 1rem auto;
    width: fit-content;
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background-color: #008BDC;
    color: #fff;
    border: 0px solid #002a42;
    transition: all 0.3s;

    &:hover{
        transform: scale(1.01);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.204);
    }
`;
const Card= styled.div`
    background-image: ${(props)=> `linear-gradient(to bottom,rgba(0, 0, 0, 0),rgba(80, 80, 80, 0.22)),url(${props.photourl})`};
    position: relative;
    background-color: #fff;
    width: 80vw;
    max-width: 30rem;
    height: 63vh;
    max-height: 43rem;
    box-shadow: 0 5px 15px rgba(136, 165, 191, 0.825);
    border-radius: 20px;
    background-size: cover;
    background-position: center;
    margin: 0 auto;

    &>h3{
        position: absolute;
        bottom: 0;
        margin: 10px;
        color: #fff;
        text-shadow: 0 1px 0 black;
    }

    @media (max-width: 900px) {
        margin-top: 2rem;
        height: 52vh;
        max-height: 38rem;
    }
`;
const LastDir= styled.p`
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
    color: #4f4f4f;
    font-weight: 500;
`;

const moveImg = keyframes`
  0%,100% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(0, 10px);
    }
`;

const ImgDiv= styled.div`
    animation: ${moveImg} 2.5s infinite ease-in-out;
    transform-origin: center center;
    display: flex;
    justify-content: center;
    align-items: center;

    &>img{
        width: 28rem;
    }

    @media (max-width: 750px) {
        &>img{
            width: 30rem;
        }
    }
`;

function Feed({currIdx, arrUser, handleIncCount, role, setIsMatched, remark}) {
    const {authUser}= useAuthContext();

    if(remark === 'No User'){
        return (
            <StyledFeed>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh"}}>
                    <ImgDiv><img src='/no-user-feed.webp' alt="No User"></img></ImgDiv>
                    <span style={{color: "#4d3bc7e3", fontWeight: "500", fontSize: "2rem"}}>No more user to swipe</span>
                    <div style={{display:"flex", alignItems: "center", paddingBottom: "18rem"}}>
                    <span>Edit preference&nbsp;</span>
                    <NavLink to={(authUser.user.role === 'candidate') ? `/edit-candidate` : `/edit-recruiter`} style={{color: "#4d3bc7e3", textDecoration: "underline", fontWeight: "500"}}>HERE</NavLink>
                    <span>&nbsp;to get more users</span>
                    </div>
                </div>
            </StyledFeed>
        );
    }

    const feedUser = [...arrUser].reverse();
    const [currentIndex, setCurrentIndex] = useState(feedUser.length - 1);
    const [lastDirection, setLastDirection] = useState();
    const SERVER_BASE_URL= import.meta.env.VITE_SERVER_URL;

    // used for outOfFrame closure
    const currentIndexRef = useRef(currentIndex)

    const childRefs = useMemo(
        () =>
            Array(feedUser.length)
                .fill(0)
                .map((i) => React.createRef()),
        []
    )

    const queryClient = useQueryClient(); 
    const { mutate: mutateRightSwipe } = useMutation({
        mutationFn: (userObj) => rightSwipeService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            
            queryClient.invalidateQueries({
                queryKey: ['feed-user']
            });

            if(data.matched === true){
                setIsMatched((val) => true);
                
            }
        },
        onError: (err) => toast.error(err.message)
    });

    const { mutate : mutateLeftSwipe } = useMutation({
        mutationFn: (userObj) => leftSwipeService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            
            queryClient.invalidateQueries({
                queryKey: ['feed-user']
            });
        },
        onError: (err) => toast.error(err.message)
    });

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val)
        currentIndexRef.current = val;
    }

    const canGoBack = currentIndex < feedUser.length - 1

    const canSwipe = currentIndex >= 0

    // set last direction and decrease current index
    const swiped = (direction, nameToDelete, index) => {
        setLastDirection((val) => direction)
        updateCurrentIndex((val) => index - 1)
        handleIncCount((val) => feedUser.length - 1 - (index -1));

        if(direction==='right'){
            const obj= {
                currentUserID: (role === 'candidate') ? arrUser[currIdx].userRecruiter._id : arrUser[currIdx].userCandidate._id,
            }
            mutateRightSwipe(obj);
        }
        else if(direction==='left'){
            const obj= {
                currentUserID: (role === 'candidate') ? arrUser[currIdx].userRecruiter._id : arrUser[currIdx].userCandidate._id,
            }
            mutateLeftSwipe(obj);
        }
    }

    const outOfFrame = (name, idx) => {
        // handle the case in which go back is pressed before card goes outOfFrame
        currentIndexRef.current >= idx && childRefs[idx].current.restoreCard()
        // TODO: when quickly swipe and restore multiple times the same card,
        // it happens multiple outOfFrame events are queued and the card disappear
        // during latest swipes. Only the last outOfFrame event should be considered valid
    }

    const swipe = async (dir) => {
        if (canSwipe && currentIndex < feedUser.length) {
            await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
        }
    }

    // increase current index and show card
    const goBack = async () => {
        if (!canGoBack) return
        const newIndex = currentIndex + 1
        updateCurrentIndex(newIndex)
        await childRefs[newIndex].current.restoreCard()
    }

    return (
        <StyledFeed>
            <CardWrapper>
                {feedUser.map((character, index) => (
                    <StyledTinderCard
                        ref={childRefs[index]}
                        key={character._id}
                        onSwipe={(dir) => swiped(dir, character.name, index)}
                        onCardLeftScreen={() => outOfFrame(character.name, index)}
                        preventSwipe={['up', 'down']}
                    >
                        {(role === 'recruiter') && 
                            <Card photourl={`${SERVER_BASE_URL}/${character.userCandidate.photo}`}> 
                                <h3>{character.userCandidate.username.split(' ')[0]}, {character.userCandidate.age} <br></br> Relocation: {(character.relocate) ? ' ✔' : ' X'}</h3> 
                            </Card>
                        }
                        {(role === 'candidate') && 
                            <Card photourl={`${SERVER_BASE_URL}/${character.userRecruiter.photo}`}> 
                                <h3>{character.userRecruiter.username.split(' ')[0]}, {character.userRecruiter.age}</h3> 
                            </Card>
                        }  
                        
                    </StyledTinderCard>
                ))}
            </CardWrapper>
            { lastDirection ? (<LastDir key={lastDirection}> You swiped {lastDirection} </LastDir>) : <LastDir>Swipe Left or Right</LastDir> }
            <Icons>
                <img src='/dislike.svg' alt='dislike' onClick={() => swipe('left')} />
                <img src='/like.svg' alt='like' onClick={() => swipe('right')} />
            </Icons>
            {(role === 'recruiter' && currentIndex>=0 && feedUser[currentIndex].resumeLink !=="") && <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}><A href={feedUser[currentIndex].resumeLink} target="_blank">Resume Link</A></div>}
        </StyledFeed>
    );
}

export default Feed;
