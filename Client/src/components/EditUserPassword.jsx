import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {updatePasswordService} from '../services/apiUser';
import toast from 'react-hot-toast';
import { useAuthContext } from "../context/AuthContext";

const UpdateForm = styled.form`
    display: flex;
    flex-direction: column;

`;
const Header = styled.p`
    font-weight: 500;
    line-height: 16px;
    letter-spacing: .5px;
    font-size: 2.5rem;
    color: #00a89b;

    @media (max-width: 480px) {
        text-align: center;
    }
    @media (max-width: 350px) {
        line-height: 0;
        letter-spacing: 0;
        font-size: 2rem;
    }
`;
const Input = styled.input`
    padding: 0 2rem;
    height: 4rem;
    width: 30rem;
    border: 1px solid #223d3e;
    border-radius: 1rem;
    background-color: #f3f5f7;

    &::placeholder{
        color: #727377;
    }

    @media (max-width: 600px) {
        padding: 0 1rem;
        width: 25rem;
    }
    @media (max-width: 350px) {
        width: 100%;
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

    @media (max-width: 600px) {
        align-items: center;
    }
`;
const FormRowDiv = styled.div`
    display: grid;
    grid-template-columns: 150px 1fr;
    align-items: center;

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
        justify-items: start;
    }
`;
const Error = styled.span`
  font-size: 1.4rem;
  color: #de587c;
`;
const Button = styled.button`
    margin-top: 1rem;
    width: fit-content;
    padding: 1rem 1.6rem;
    background-color: #77d4d9;
    border: none;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
    border-radius: 1rem;
    color: #2f2f2f;

    font-size: 1.6rem;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    
    &:hover{
        transform: scale(1.01);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.204);
    }
`;

function EditUserPassword() {
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;

    const {authUser, setAuthUser}= useAuthContext();

    const queryClient = useQueryClient(); 
    const { isLoading: updatingInfo, mutate } = useMutation({
        mutationFn: (userObj) => updatePasswordService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("User pasword updated successfully");
            
            queryClient.invalidateQueries({
                queryKey: ['user-info']
            });


            localStorage.setItem('auth-user', JSON.stringify(data.data));
            setAuthUser((val) => data.data);
        },
        onError: (err) => toast.error(err.message)
    });

    function myOwnSubmitFn(data) {
        // {currentPassword, newPassword, newConfirmPassword}
        const updateObj={
            currentPassword: data.oldPassword,
            newPassword: data.password,
            newConfirmPassword: data.confirmPassword
        }
        mutate(updateObj);
        reset();
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    return (
        <UpdateForm onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>

            <Header style={{ fontSize: "2rem", color: "#de587c", margin: "5rem 0 1.5rem 0" }}>CHANGE PASSWORD</Header>
            <FormRow>
                <FormRowDiv>
                    <label htmlFor="oldPassword">Old Password:</label>
                    <Input
                        type='password'
                        id='oldPassword'
                        placeholder="Old Password"
                        {...register('oldPassword', {
                            required: 'This field is required',
                            minLength: {
                                value: 8,
                                message: 'Password needs a minimum of 8 characters',
                            }
                        })}
                    />
                </FormRowDiv>
                {errors?.oldPassword?.message && <Error>{errors.oldPassword.message}</Error>}
            </FormRow>
            <FormRow>
                <FormRowDiv>
                    <label htmlFor="password">New Password:</label>
                    <Input
                        type='password'
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
                </FormRowDiv>
                {errors?.password?.message && <Error>{errors.password.message}</Error>}
            </FormRow>

            <FormRow>
                <FormRowDiv>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <Input
                        type='password'
                        id='confirmPassword'
                        placeholder="Confirm Password"
                        {...register('confirmPassword', {
                            required: 'This field is required',
                            validate: (value) => getValues().password === value || 'Passwords need to match',
                        })}
                    />
                </FormRowDiv>
                {errors?.confirmPassword?.message && <Error>{errors.confirmPassword.message}</Error>}
            </FormRow>

            <FormRow>
                <Button>Update Password</Button>
            </FormRow>
        </UpdateForm>
    );
}

export default EditUserPassword;
