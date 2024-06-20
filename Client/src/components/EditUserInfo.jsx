import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {updateInfoService} from '../services/apiUser';
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
const UserImg = styled.div`
    margin: 4rem 0;
    display: flex;
    align-items: center;
    gap: 2rem;
    position: relative;
    &>img{
        border-radius: 1rem;
        width: 100px;
    }

    @media (max-width: 480px) {
        flex-direction: column;
        align-items: center;
    }
`;
const LabelForFileInput = styled.label`
    width: 120px;
    padding: 1rem 0;
    background-color: #f3f5f7;
    color: #727377;
    display: flex;
    gap: 2rem;
    justify-content: center;
    cursor: pointer;
    
    border-radius: 2rem;
    box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
    transition: transform 0.3s;

    &:hover{
        transform: translateY(-2px);
    }
`;
const ImgCam = styled.img`
    width: 2rem;
`;
const HeaderRow= styled.div`
    display: flex;
    gap: 1rem;

    @media (max-width: 550px) {
        flex-direction: column;
    }
    @media (max-width: 480px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
`;

const Input = styled.input`
    padding: 0 2rem;
    height: 4rem;
    width: 30rem;
    border: 1px solid #223d3e;
    border-radius: 1rem;
    background-color: #f3f5f7;

    &[type="file"] {
        display: none;
    }

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

    @media (max-width: 450px) {
        align-items: center;
    }
`;
const FormRowDiv = styled.div`
    display: grid;
    grid-template-columns: 150px 1fr;
    align-items: center;
    
    @media (max-width: 600px) {
        grid-template-columns: 50px 1fr;
        justify-items: center;
    }

    @media (max-width: 480px) {
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

function EditUserInfo({userInfo}) {
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;
    const {authUser, setAuthUser}= useAuthContext();
    const SERVER_BASE_URL= import.meta.env.VITE_SERVER_URL;
    // const [fileSelected, setFileSelected] = useState(false);

    const queryClient = useQueryClient(); 
    const { isLoading: updatingInfo, mutate } = useMutation({
        mutationFn: (userObj) => updateInfoService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("User info updated successfully");
            
            queryClient.invalidateQueries({
                queryKey: ['user-info']
            });

            localStorage.setItem('auth-user', JSON.stringify(data.data));
            setAuthUser((val)=> data.data);
        },
        onError: (err) => toast.error(err.message)
    });

    // const handleFileChange = (event) => {
    //     if (event.target.files.length > 0) {
    //         setFileSelected(true);
    //     } else {
    //         setFileSelected(false);
    //     }
    // };

    function myOwnSubmitFn(data) {
        const formData= new FormData();
        formData.append('username', data.username);
        formData.append('age', data.age);
        if(data.userPhoto.length !== 0) { formData.append('photo', data.userPhoto[0]); }
        mutate(formData);
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    return (
        <UpdateForm onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
            <HeaderRow>
                <Header>EDIT INFORMATION</Header>
                <span style={{ textShadow: "0 0 5px #fff,0 0 10px #fff,0 0 20px #fff,0 0 40px #00a89b,0 0 80px #00a89b,0 0 90px #00a89b,0 0 100px #00a89b,0 0 150px #00a89b", fontWeight: "500", marginLeft: "2rem" }}>[{userInfo.role[0].toUpperCase()+userInfo.role.substring(1)}]</span>
            </HeaderRow>
            <UserImg>
                <img src={`${SERVER_BASE_URL}/${userInfo.photo}`} alt='user image' onError={`this.onerror=null; this.src=${SERVER_BASE_URL}/default.jpeg;`}/>
                <div style={{display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center"}}>
                    <LabelForFileInput htmlFor="userPhoto"> <ImgCam src='/camera.svg' alt="camera" /></LabelForFileInput>
                    <Input
                        type="file"
                        id="userPhoto"
                        accept="image/*"
                        {...register('userPhoto')}
                    />
                    <Button style={{marginTop: "0"}} disabled={updatingInfo}>Upload</Button>
                </div>
                
            </UserImg>
            <Header style={{ fontSize: "2rem", color: "#de587c", margin: "2rem 0 1.5rem 0" }}>ACCOUNT INFORMATION</Header>
            <FormRow>
                <FormRowDiv>
                    <label htmlFor="email">Email:</label>
                    <Input
                        type='text'
                        id='email'
                        defaultValue={userInfo.email}
                        disabled
                    />
                </FormRowDiv>
            </FormRow>
            <FormRow>
                <FormRowDiv>
                    <label htmlFor="username">Name:</label>
                    <Input
                        type='text'
                        id='username'
                        defaultValue={userInfo.username}
                        {...register('username', {
                            required: 'This field is required'
                        })}
                    />
                </FormRowDiv>
                {errors?.username?.message && <Error>{errors.username.message}</Error>}
            </FormRow>
            <FormRow>
                <FormRowDiv>
                    <label htmlFor="age">Age:</label>
                    <Input
                        type='number'
                        id='age'
                        defaultValue={userInfo.age}
                        {...register('age', {
                            required: 'This is required',
                            validate: (value) => (value >= 14 && value <= 80) || 'Age should be from 14 to 80'
                        })}
                    />
                </FormRowDiv>
                {errors?.age?.message && <Error>{errors.age.message}</Error>}
            </FormRow>
            <FormRow>
                <Button disabled={updatingInfo}>Update Account Info</Button>
            </FormRow>
        </UpdateForm>
    );
}

export default EditUserInfo;
