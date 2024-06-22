import styled, { keyframes } from "styled-components";
import Message from "../components/Message";
import Feed from "../components/Feed";
import UserCandidate from "../components/UserCandidate";
import NavMainPage from "../components/NavMainPage";
import Modal from '../components/Modal';
import { useEffect, useState } from "react";
import ConfettiExplosion from 'react-confetti-explosion';
import Chat from "../components/Chat";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useRoleContext } from "../context/RoleContext";
import UserRecruiter from "../components/UserRecruiter";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getFeedService } from "../services/apiFeed";
import toast from 'react-hot-toast';
import FeedLoading from '../components/skeletons/FeedLoading';
import RoleInfoLoader from "../components/skeletons/RoleInfoLoader";


const StyledMainPage= styled.div`
    height: 100vh;
    max-height: 100vh;
    width: 100vw;
    max-width: 100vw;
    display: grid;
    grid-template-columns: 1fr 0.8fr 1fr;
    grid-template-rows: 8rem 1fr;
    overflow: scroll;
    color: #4f4f4f; 

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */

    @media (max-width: 1200px) {
        grid-template-columns: 0.8fr 1fr;
    }

    @media (max-width: 750px) {
        grid-template-columns: 1fr;
        width: 100vw;
        max-width: 60rem;
        margin: 0px auto;
        overflow-x: hidden;
    }
`;
const Button= styled.button`
    width: fit-content;
    padding: 1.2rem 1.8rem;
    background-color: #72cace;
    border: 1px solid #223d3e;
    border-radius: 1rem;

    font-size: 1.8rem;
    font-weight: 500;
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    
    &:hover{
        transform: scale(1.01);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.204);
    }

    @media (max-width: 450px) {
        padding: 0.6rem 1.2rem;
    }
`;

const Eyes= styled.div`
	display: flex;
	justify-content: center;
	gap: 5px;
    position: relative;
`;

const Eye = styled.div`
	width: 6rem;
	height: 6rem;
	background-color: #faca2e;
	border-radius: 50%;
	display: grid;
	place-items: center;
`;

const movePupil = keyframes`
  0%,100% {
        transform: translate(0, 0);
    }
    25% {
        transform: translate(-5px, -5px);
    }
    50% {
        transform: translate(5px, 5px);
    }
    75% {
        transform: translate(-5px, 5px);
    }
`;

const Pupil = styled.div`
    width: 2rem;
    height: 2rem;
    background-color: #191F45;
    border-radius: 50%;
    animation: ${movePupil} 2s infinite ease-in-out;
    transform-origin: center center;
`;

const Smile= styled.div`
    overflow: hidden;
    border: 5px solid #191F45;
    box-sizing: border-box;
    width: 120px;
    height: 60px;
    border-radius: 5px 5px 60px 60px;
    background: #191F45;
    position: absolute;
    top: 7rem;
    left: 50%;
    transform: translateX(-50%);
    &:after{
        content: ""; 
        width: 100px;
        height: 50px;
        background: #EE6055;
        border-radius: 50px 50px 0 0;
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
    }
`;

function MainPage() {
    const navigate= useNavigate();
    const {authUser} = useAuthContext();
    const {roleUser} = useRoleContext();

    const [feedUser, setFeedUser] = useState([]);
    const [currIdx, setCurrIdx] = useState(-1);
    const [count, setCount] = useState(0);
    const [isMatched, setIsMatched] = useState(false);

    const [fetchingFeed, setFetchingFeed] = useState(false);

    if(!authUser){
        return (
            <Modal isOpen={true}>
                <>
                    <h3>User logged out, Please login again</h3>
                    <Button style={{margin: "0 auto", marginTop: "2rem", color: "black"}} onClick={()=>navigate('/login')}>Login</Button>
                </>
            </Modal>
        );
    }

    const handleIncCount= function (val) {
        setCount((cnt) => cnt+1);
        // setCurrIdx((idx) => idx+1);
        setCurrIdx(val); // increament hi karenge
    }

    const queryClient = useQueryClient(); 
    const { mutate } = useMutation({
        mutationFn: (userObj) => getFeedService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            queryClient.invalidateQueries({
                queryKey: ['feed-user']
            });
            setFetchingFeed((val)=> false);

            if(data.data.finalResult.length === 0){ // no more account (RESET everything)
                setFeedUser((val) => null);
                setCurrIdx((val) => -1);
                setCount((val) => 0);
            }
            else{
                setCurrIdx((val) => 0); // start form begining
                setFeedUser((val) =>data.data.finalResult);
            }
        },
        onError: (err) => toast.error(err.message),
        onMutate: () => setFetchingFeed((val)=> true)
    });

    useEffect(() => {
        const obj= {
            batchSize: 2,
            offsetLength: count,
            preference: roleUser.preference
        }
        if(currIdx === -1 || currIdx === feedUser.length){ // refetch feed
            mutate(obj);
        }
    }, [count, currIdx, feedUser]);


    const [messageOpened, setMessageOpened] = useState(false);
    const [msgUserId, setMsgUserId] = useState('');
    const [msgUserName, setMsgUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('');
    
 
    const handleClose = () => {
        setIsMatched((val) => false);
    };

    return (
        <StyledMainPage>
            <NavMainPage type='feed' />

            {(!messageOpened) ?
                <Message type='small' setMessageOpened={setMessageOpened} setMsgUserId={setMsgUserId} setMsgUserName={setMsgUserName} setUserPhoto={setUserPhoto} /> :
                <Chat type='small' msgUserId={msgUserId} setMessageOpened={setMessageOpened} msgUserName={msgUserName} userPhoto={userPhoto}/>
            }

            {fetchingFeed && <FeedLoading />}
            {(!fetchingFeed && (feedUser && feedUser.length > 0)) && <Feed currIdx={currIdx} handleIncCount={handleIncCount} arrUser={feedUser} role={authUser.user.role} setIsMatched={setIsMatched}/>}
            {(!fetchingFeed && (!feedUser || feedUser.length === 0)) && <Feed remark="No User"/>}
            
            {fetchingFeed && <RoleInfoLoader />}
            {(feedUser && feedUser.length > 0 && authUser.user.role === 'recruiter') && <UserCandidate roleInfo={feedUser[currIdx]} />}
            {(feedUser && feedUser.length > 0 && authUser.user.role === 'candidate') && <UserRecruiter roleInfo={feedUser[currIdx]} />}
            {(!fetchingFeed && (!feedUser || feedUser.length === 0)) && <UserCandidate remark="No User"/>}
            <Modal isOpen={isMatched} onClose={handleClose}>
                <>
                    <Eyes>
                        <Eye> <Pupil /> </Eye>
                        <Eye> <Pupil /> </Eye>
                        <Smile />
                    </Eyes>
                    <h2 style={{marginTop: "7rem"}}> yeaah </h2>
                    <ConfettiExplosion width={2000} height={1500} particleCount={150} duration={5000} />
                    <h3>&#127881; It's a match! &#128512;</h3>
                </>
            </Modal>
        </StyledMainPage>
    );
}

export default MainPage;
