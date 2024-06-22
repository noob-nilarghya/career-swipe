import styled from "styled-components";
import Header from "../components/Header";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useAuthContext } from "../context/AuthContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {resetPasswordService} from '../services/apiUser';
import toast from "react-hot-toast";
import { useParams } from 'react-router-dom';

const StyledResetPwd= styled.div`
    height: 100vh;
    background-color: #f1fafa;
`;
const Msg = styled.span`
  font-size: 1.4rem;
  margin: 0 auto;
  color: #de587c;
`;
const Body= styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    font-weight: 500;
    position: relative;
    padding: 10rem 1rem;

    &>span{
        text-align: center;
    }

    @media (max-width: 400px){
        gap: 0.8rem;
    }
`;
const Input= styled.input`
    padding: 0 2rem;
    height: 4rem;
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

  padding: 1rem 0;

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
        gap: 0;
    }
`;
const Button= styled.button`
    width: fit-content;
    padding: 1rem 1.6rem;
    background-color: #72cace;
    border: 1px solid #223d3e;
    border-radius: 1rem;
    color: #2f2f4f;

    font-size: 1.6rem;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 450px) {
        padding: 0.7rem 1.4rem;
    }
`;

function ResetPassword() {
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;
    const navigate= useNavigate();
    const {authUser}= useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const { token } = useParams(); // Extract the token from the URL

    const queryClient = useQueryClient(); 
    const { isLoading, mutate } = useMutation({
        mutationFn: (userObj) => resetPasswordService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("Password Reset Successful. Redirecting to login page...");
            
            queryClient.invalidateQueries({
                queryKey: ['password-forgot']
            });

            setTimeout(()=>{ 
                navigate('/login');
            }, 1500);
        },
        onError: (err) => toast.error(err.message)
    });

    function myOwnSubmitFn(data) {
        const userObj={
            token: token, password: data.password, confirmPassword: data.confirmPassword
        };
        mutate(userObj);
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    return (
        <StyledResetPwd>
            <Header />
            <Body onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
                <span style={{ color: "#4f4f4f", marginBottom: "1rem" }}>RESET YOUR PASSWORD NOW :)</span>
                <FormRow style={{position: "relative"}}>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        placeholder="Enter New Password"
                        {...register('password', {
                            required: 'This field is required',
                            minLength: {
                                value: 8,
                                message: 'Password needs a minimum of 8 characters',
                            }
                        })}
                    />
                    <img src={showPassword ? '/eye-slash.svg' : '/eye.svg'} alt="show/hide password" onClick={() => setShowPassword(!showPassword)} style={{cursor: "pointer", position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", width: "2rem"}}></img>
                    {errors?.password?.message && <Msg>{errors.password.message}</Msg>}
                </FormRow>
                <FormRow>
                    <Input
                        type='password'
                        id='confirmPassword'
                        placeholder="Confirm New Password"
                        {...register('confirmPassword', {
                            required: 'This field is required',
                            validate: (value) => getValues().password === value || 'Passwords need to match',
                        })}
                    />
                    {errors?.confirmPassword?.message && <Msg>{errors.confirmPassword.message}</Msg>}
                </FormRow>
                <FormRow>
                    <Button disabled={authUser}>Reset Password</Button>
                </FormRow>
                <div style={{color: "#5a8b8d", margin: "0 auto", borderBottom: "1.8px solid #5a8b8d", width: "fit-content"}}><NavLink to="/register">Back to Login page &#10132;</NavLink></div>
            </Body>
            {authUser && 
                <Modal isOpen={true}>
                    <>
                        <h3>{authUser.user.username.split(' ')[0]} is currently logged in</h3>
                        <h4>Please log out before accessing this page</h4>
                        <Button style={{margin: "0 auto", marginTop: "2rem"}} onClick={()=>navigate(-1)}>Go back</Button>
                    </>
                </Modal>
            }
        </StyledResetPwd>
    );
}

export default ResetPassword;


