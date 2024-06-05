import styled from "styled-components";
import NavMainPage from "../components/NavMainPage";
import { Link } from "react-router-dom";
import EditUserInfo from "../components/EditUserInfo";
import EditUserPassword from "../components/EditUserPassword";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { disableAccService, logoutService } from "../services/apiUser";
import toast from 'react-hot-toast';
import Modal from "../components/Modal";
import { useRoleContext } from "../context/RoleContext";


const StyledAccountSetup= styled.div`
    height: 100vh;
    max-height: 100vh;
    display: grid;
    grid-template-rows: 8rem 1fr;
    row-gap: 3rem;
    background-color: #f5f5f5;

    overflow: scroll;
    color: #4f4f4f; 

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
`;
const Wrapper= styled.div`
    padding: 0 5rem;
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 4rem;

    overflow: scroll;

    &::-webkit-scrollbar { 
        display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */

    @media (max-width: 1300px) {
        grid-template-columns: 1fr 2.5fr;
    }
    @media (max-width: 1100px) {
        grid-template-columns: 1fr 2fr;
    }
    @media (max-width: 1000px) {
        grid-template-columns: 1fr;
    }
    @media (max-width: 700px) {
        padding: 0 2rem;
    }
    @media (max-width: 350px) {
        padding: 0 0.5rem;
    }
`;
const Options= styled.div`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    height: fit-content;
    border-radius: 1rem;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    &>div{
        display: flex;
        gap: 3rem;
        padding: 1.5rem 5rem;
        border-bottom: 2px solid #ddd;
        transition: all 0.3s;

        &:hover{
            transform: scale(1.05);
        }
    }
    &>div>img{
        width: 28px;
        height: 28px;
    }
    @media (max-width: 1000px) {
        display: none;
    }
    
`;
const FormWrapper= styled.div`
    overflow: scroll;

    &::-webkit-scrollbar { 
    display: none;
    }

    -ms-overflow-style: none; /* for Internet Explorer, Edge */
    scrollbar-width: none; /* for Firefox */
    background-color: #fff;
    border-radius: 1rem;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 3rem 8rem;

    @media (max-width: 450px) {
        padding: 3rem;
    }
    @media (max-width: 350px) {
        padding: 3rem 1rem;
    }
`;
const Button= styled.button`
    width: 16rem;
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
`;



function AccountSetup() {
    const navigate= useNavigate();
    const {authUser, setAuthUser}= useAuthContext();
    const {roleUser, setRoleUser} = useRoleContext();
    if(!authUser){
        return (
            <Modal isOpen={true}>
                <>
                    <h2>User logged out, Please login again</h2>
                    <Button style={{margin: "0 auto", marginTop: "2rem", color: "black"}} onClick={()=>navigate('/login')}>Login</Button>
                </>
            </Modal>
        );
    }

    const {loggingOut, error, refetch} = useQuery({
        queryKey: ['user-login'],
        queryFn: () => logoutService(),
        enabled: false, // Initialize useQuery with enabled set to false
        refetchOnWindowFocus: false, // Disable automatic refetch on window focus
    });

    const queryClient = useQueryClient(); 
    const { isLoading: disablingAcc, mutate } = useMutation({
        mutationFn: (obj) => disableAccService(obj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("User account deactivating...");

            queryClient.invalidateQueries({
                queryKey: ['user-login', 'user-register']
            });

            setTimeout(()=>{
                localStorage.removeItem('role-user');
                setRoleUser((val) => null);
                localStorage.removeItem('auth-user');
                setAuthUser((val) => null);
                navigate('/login');
            }, 1500);
        },
        onError: (err) => toast.error(err.message)
    });

    const handleDisableClick= () => {
        const obj={ role: authUser.user.role }
        mutate(obj);
    }
    
    const userInfo = { username: authUser.user.username, email: authUser.user.email, age: authUser.user.age, photo: authUser.user.photo, role: authUser.user.role};

    return (
        <StyledAccountSetup>
            <NavMainPage />
            <Wrapper>
                <Options>
                    <div>
                        <img src='/feed.svg' alt='feed'></img>
                        <Link to='/feed'>FEED</Link>
                    </div>
                    <div>
                        <img src='/editAcc.svg' alt='editAcc'></img>
                        <Link to='/edit-account' disabled style={{color: "#00a89b"}}>EDIT ACCOUNT</Link>
                    </div>
                    <div>
                        <img src='/editPro.svg' alt='editPro'></img>
                        <Link to='/edit-candidate'>EDIT BIO</Link>
                    </div>
                    <div>
                        <img src='/aboutUs.svg' alt='aboutUs'></img>
                        <Link to='/about'>ABOUT US</Link>
                    </div>
                    <div>
                        <img src='/deactivateAcc.svg' alt='logout'></img>
                        <span style={{color: "#de587c", cursor: "pointer"}} onClick={handleDisableClick}>DISABLE ACCOUNT</span>
                    </div>
                </Options>
                <FormWrapper>
                    <EditUserInfo userInfo={userInfo} />
                    <EditUserPassword />
                </FormWrapper>
            </Wrapper>
        </StyledAccountSetup>
    );
}

export default AccountSetup;
