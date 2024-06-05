import styled from "styled-components";
import Header from "../components/Header";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";

const StyledForgotPwd= styled.div`
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
    gap: 2rem;
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
const FormRowDiv= styled.div`
    display: grid;
    grid-template-columns: 100px 1fr;
    align-items: center;

    @media (max-width: 400px){
        grid-template-columns: 60px 1fr;
    }
`;
const Button= styled.button`
    width: fit-content;
    padding: 1rem 1.6rem;
    background-color: #72cace;
    border: 0px solid #223d3e;
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

function ForgotPassword() {
    const [sentLink, setSentLink] = useState(false);
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;
    const navigate= useNavigate();
    const {authUser}= useAuthContext();

    function myOwnSubmitFn(data) {
        setSentLink(true);
        console.log(data);
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    return (
        <StyledForgotPwd>
            <Header />
            <Body onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
                <span style={{ color: "#4f4f4f", marginBottom: "1rem" }}>ENTER THE REGISTERED EMAIL TO GET RESET-CODE</span>
                <FormRow>
                    <FormRowDiv>
                        <label htmlFor="email">Email:</label>
                        <Input
                            type='text'
                            id='email'
                            placeholder="Enter your Email"
                            {...register('email', {
                                required: 'This field is required'
                            })}
                        />
                    </FormRowDiv>
                    {errors?.email?.message && <Msg>{errors.email.message}</Msg>}
                </FormRow>
                <FormRow>
                    <Button disabled={authUser}>Get Reset Link</Button>
                </FormRow>
                <div style={{color: "#5a8b8d", margin: "0 auto", borderBottom: "1.8px solid #5a8b8d", width: "fit-content"}}><NavLink to="/login">Back to Login page &#10132;</NavLink></div>
                {sentLink && <Msg>Reset Link has been sent to email, please check :)</Msg>}
            </Body>
            {authUser && 
                <Modal isOpen={true}>
                    <>
                        <h2>{authUser.user.username.split(' ')[0]} is currently logged in</h2>
                        <h4>Please log out before accessing this page</h4>
                        <Button style={{margin: "0 auto", marginTop: "2rem"}} onClick={()=>navigate(-1)}>Go back</Button>
                    </>
                </Modal>
            }               
        </StyledForgotPwd>
    );
}

export default ForgotPassword;
