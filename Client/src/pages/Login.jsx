import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {loginService} from '../services/apiUser';
import toast from 'react-hot-toast';
import { useAuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";
import { useRoleContext } from "../context/RoleContext";
import { useState } from "react";

const StyledLogin = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100vh;
    padding: 2rem;

    @media (max-width: 800px){
        grid-template-columns: 1.2fr 1fr;
        padding: 2rem 0 2rem 1rem;
    }
    @media (max-width: 650px){
        padding: 2rem 1rem 2rem 1rem;
        grid-template-columns: 1fr;
    }
`;
const LoginForm = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    font-weight: 500;
    position: relative;
`;
const DivImg = styled.div`
    background-color: #e3f4f5;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 2rem 0 0 2rem;

    @media (max-width: 650px){
        display: none;
    }
`;
const Img = styled.img`
    width: 70%;

    @media (max-width: 1000px){
        width: 90%;
    }
    @media (max-width: 800px){
        width: 98%;
    }
`;
const Logo = styled.img`
    width: 16rem;
    padding-bottom: 2rem;
    cursor: pointer;
`;
const Form= styled.form`
    padding: 3rem;
    background: rgba( 255, 255, 255, 0.10 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 1px );
    -webkit-backdrop-filter: blur( 1px );
    border-radius: 20px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );

    @media (max-width: 900px){
        width: 90%;
    }
    @media (max-width: 700px){
        padding: 2rem;
    }
    @media (max-width: 650px){
        max-width: 40rem;
    }
    @media (max-width: 400px){
        width: 95%;
    }
`;
const Input= styled.input`
    padding: 0 2rem;
    height: 5rem;
    width: 30rem;
    border: 1px solid #223d3e;
    border-radius: 1rem;
    background-color: #f3f5f7;

    &::placeholder{
        color: #727377;
    }

    @media (max-width: 900px) {
        width: 100%;
    }

    @media (max-width: 350px){
        padding: 0 1.5rem;
        height: 4.5rem;
    }
`;
const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }

    @media (max-width: 350px){
        padding: 1rem 0;
        gap: 0;
    }
`;
const Error = styled.span`
  font-size: 1.4rem;
  color: #de587c;
`;
const Button= styled.button`
    width: 16rem;
    padding: 1.2rem 1.8rem;
    background-color: #79d8dd;
    border: 0px solid #223d3e;
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
        width: 14rem;
        padding: 0.7rem 1.4rem;
    }
`;
const GoBackImg= styled.img`
    width: 3.5rem;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover{
        transform: translateX(5px);
    }
`;

function Login() {
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;
    const navigate= useNavigate();
    const {authUser, setAuthUser}= useAuthContext();
    const {roleUser, setRoleUser}= useRoleContext();
    const [showPassword, setShowPassword] = useState(false);

    const queryClient = useQueryClient(); 
    const { isLoading: loggigin, mutate } = useMutation({
        mutationFn: (userObj) => loginService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("User logged-in successfully");
            
            queryClient.invalidateQueries({
                queryKey: ['user-login', 'user-candidate']
            });

            setTimeout(()=>{ 
                localStorage.setItem('role-user', JSON.stringify(data.roleInfo));
                setRoleUser((val) => data.roleInfo);
                localStorage.setItem('auth-user', JSON.stringify(data.loginInfo));
                setAuthUser((val) => data.loginInfo);
                navigate('/feed');
            }, 1500);
        },
        onError: (err) => toast.error(err.message)
    });

    function myOwnSubmitFn(data) {

        const userObj={
            email: data.email, password: data.password
        };
        mutate(userObj);
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    return (
        <StyledLogin>
            <LoginForm>
                <GoBackImg src='/goBack.svg' onClick={()=>navigate(-1)} alt="back" />
                <Logo src='/logo-assets/logo-text.webp' onClick={()=> navigate('/')} alt="logo" />
                <span style={{ color: "#838689" }}>Login using your e-mail and password</span>

                <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
                    <FormRow>
                        <Input
                            type='email'
                            id='email'
                            placeholder="Email"
                            {...register('email', {
                                required: 'This field is required',
                                pattern: {
                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'Enter correct email'
                                }
                            })}
                        />
                        {errors?.email?.message && <Error>{errors.email.message}</Error>}
                    </FormRow>

                    <FormRow style={{position: "relative"}}>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            placeholder="Password"
                            {...register('password', {
                                required: 'This field is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password needs a minimum of 8 characters',
                                }
                            })}
                        />
                        <img src={showPassword ? '/eye-slash.svg' : '/eye.svg'} alt="show/hide password" onClick={() => setShowPassword(!showPassword)} style={{cursor: "pointer", position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", width: "2rem"}}></img>
                        {errors?.password?.message && <Error>{errors.password.message}</Error>}
                    </FormRow>
                    <FormRow>
                        <Button disabled={authUser || loggigin }><img style={{width: "18%"}} src='/login.svg' alt="" /> Login</Button>
                    </FormRow>
                </Form>
                <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                    <div style={{color: "#e16989", margin: "0 auto", borderBottom: "1.8px solid #e16989", width: "fit-content"}}><NavLink to="/register">Don't have an account? Register</NavLink></div>
                    <div style={{color: "#e16989", margin: "0 auto", borderBottom: "1.8px solid #e16989", width: "fit-content"}}><NavLink to="/password-forgot">Forgot password ?</NavLink></div>
                </div>
            </LoginForm>
            <DivImg>
                <Img src='/page-asset/girl-hr-with-bg.svg' alt="girl facing laptop" />
            </DivImg>
            {authUser && 
                <Modal isOpen={true}>
                    <>
                        <h2>{authUser.user.username.split(' ')[0]} is currently logged in</h2>
                        <h4>Please log out before accessing this page</h4>
                        <Button style={{margin: "0 auto", marginTop: "2rem"}} onClick={()=>navigate('/feed')}>Go to feed</Button>
                    </>
                </Modal>
            }
        </StyledLogin>
    );
}

export default Login;
