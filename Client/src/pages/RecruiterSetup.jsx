import styled from "styled-components";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import JDdata from '../components/recruiterProfile/JDdata';
import JDform from '../components/recruiterProfile/JDform';
import { useState } from "react";
import { useRoleContext } from "../context/RoleContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addRecruiterService, removeRecruiterService } from "../services/apiRecruiter";
import toast from 'react-hot-toast';

const StyledRecruiter = styled.div`
    width: 100rem;
    padding: 3rem 3rem;
    margin: 0 auto;
    color: #666;
    margin: 7rem auto;
    border-radius: 1rem;

    background: rgba( 255, 255, 255, 0.25 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    border: 1px solid rgba( 255, 255, 255, 0.18 );

    @media (max-width: 1100px) {
        width: 95%;
    }
    @media (max-width: 450px) {
        width: 98%;
    }
`;
const ZerothRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    padding: 1.5rem 0rem;

    @media (max-width: 650px) {
        grid-template-columns: 1fr;
        row-gap: 2rem;
    }
`;
const ZerothRowDiv= styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-weight: 500;

    @media (max-width: 650px) {
        gap: 0.6rem;
        align-items: center;
    }
`;
const Select= styled.select`
    border-radius: 0.6rem;
`;
const Hr = styled.hr`
    border: none;
    border-top: 1px solid #ddd;
    width: 90%;
    margin: 1rem auto;
`;
const FirstRow = styled.div`
    display: flex;
    gap: 5rem;
    justify-content: center;
    padding: 1.5rem 0rem;
`;
const TextAreaWrapper = styled.div`
    padding-top: 1.5rem;
    display: flex;
    gap: 1rem;

    @media (max-width: 500px) {
        position: relative;
    }
`;
const TextArea = styled.textarea`
    width: 90%;
    padding: 1rem 2rem;
    resize: none;
    border-radius: 0.5rem;

    @media (max-width: 500px) {
        width: 100%;
        padding: 1rem;
    }
`;
const TextAreaBtn = styled.button`
    width: fit-content;
    align-self: flex-end;
    padding: 0.1rem 0.3rem;
    border-radius: 0.5rem;
    border: 1px solid black;

    @media (max-width: 500px) {
        position: absolute;
        right: 0.5rem;
        bottom: 0.5rem;
    }
`;
const Grid2Col = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    padding: 1.5rem 0rem;

    @media (max-width: 850px) {
        grid-template-columns: 150px 1fr;
    }
    @media (max-width: 650px){
        grid-template-columns: 1fr;
        row-gap: 1rem;
        padding: 1.6rem 0rem;
    }
`;
const SectionHeading = styled.p`
    font-weight: 500;
    line-height: 16px;
    letter-spacing: .5px;
    padding-left: 1rem;

    @media (max-width: 650px){
        text-decoration: underline;
    }
`;
const SectionData = styled.div`
    display: grid;
    grid-template-columns: 1fr 10rem;

    @media (max-width: 850px) {
        grid-template-columns: 1fr 2rem;
        column-gap: 1rem;
    }
`;
const Button = styled.button`
    color: ${(props)=> props.jdForm ? "#de587c" : "#008BDC"};
    width: fit-content;
    background: none;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    border: ${(props) => props.jdForm ? "2px solid #de587c" : "2px solid #008BDC"}
`;
const Heading = styled.p`
    font-Weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
    font-size: 2.5rem; 
    color: #00a89b;
    text-transform: uppercase;
`;
const GoToFeed = styled.div`
    position: absolute;
    top: 15px;
    left: 15px;
    cursor: pointer;
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: transform 0.3s;
    width: 4rem;

    &>span{
        color: #00a89b;
        font-weight: 500;
        font-size: 1.6rem;
        border-bottom: 3px solid #00a89b;
    }
    &:hover{
        transform: translateX(5px);
    }
`;
const ModalButton = styled.button`
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
const EditTrash= styled.div`
    display: flex;
    gap: 2rem;
    justify-content: flex-end;
    width: 100%;
    align-items: flex-start;
    padding-top: 0.8rem;

    &>img {
        width: 18%;
        cursor: pointer;
        transition: transform 0.3s;
    }
    &>img:hover{
        transform: scale(1.05);
    }

    @media (max-width: 850px) {
        &>img {
            width: 100%;
        }
    }
`;
const JD= styled.div`
    padding: 1.5rem 0rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

function RecruiterSetup() {
    const navigate = useNavigate();
    const { authUser } = useAuthContext();
    const {roleUser, setRoleUser}= useRoleContext();
    if (!authUser) {
        return (
            <Modal isOpen={true}>
                <>
                    <h2>User logged out, Please login again</h2>
                    <ModalButton style={{ margin: "0 auto", marginTop: "2rem", color: "black" }} onClick={() => navigate('/login')}>Login</ModalButton>
                </>
            </Modal>
        );
    }

    const name = authUser.user.username;
    const [preference, setPreference] = useState(roleUser.preference);
    const [bio, setBio] = useState(roleUser.bio);
    const [jobDescription, setJobDescription] = useState(roleUser.jobDescription);

    const [preferenceForm, setPreferenceForm] = useState(false);
    const handlePreferenceForm= function() {
        setPreferenceForm((val)=> !val);
    }

    const [bioForm, setBioForm] = useState(false);
    const handleBioForm = function () {
        setBioForm((val) => !val);
    }

    const [jdForm, setJdForm] = useState(false);
    const handleJDform= function(){
        setJdForm((val)=> !val);
    }

    const queryClient= useQueryClient();
    const {isLoading, mutate}= useMutation({
        mutationFn: (obj) => addRecruiterService(obj),
        onSuccess: (data) => {
            toast.success("Data updated successfully");

            queryClient.invalidateQueries({
                queryKey: ['user-recruiter']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalRecruiter));
            setRoleUser((val) => data.data.finalRecruiter);
        },
        onError: (err) => toast.error(err.message)
    });


    const {isLoading: deletingJD, mutate: mutateDelJD}= useMutation({
        mutationFn: (obj) => removeRecruiterService(obj),
        onSuccess: (data) => {
            toast.success("Job Description Removed successfully");

            queryClient.invalidateQueries({
                queryKey: ['user-recruiter']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalRecruiter));
            setRoleUser((val) => data.data.finalRecruiter);
            window.location.reload();
        },
        onError: (err) => toast.error(err.message)
    });

    const handlePreferenceSubmit= function(evt){
        const selectedValue = evt.target.value;
        setPreference(selectedValue);
        const obj= {type: "default", preference: selectedValue};
        mutate(obj);
        handlePreferenceForm();
    }

    const handleBioSubmit= function() {
        const obj= { type: "default", bio: bio };
        mutate(obj);
        handleBioForm();
    }

    const handleRemoveJD= function(){
        const obj={
            type: "jd",
            id: roleUser.jobDescription._id,
        }
        const confirmation = window.confirm("Are you surely want to delte this?");
        if (confirmation) {
            setJobDescription(null);
            mutateDelJD(obj);
        }
    }


    /* ---- 7 Points (Thala for a reason 😂) ----
        1. We will have Name, email, role at the top row just like candidate
        2. We will have preference along with edit option at the second row (editFields/addFields controller)
        3. We will have a bio field on the third row and we will have a edit option just like candidate (editFields/addFields controller)
        4. We will have a butoon to add/remove Job description which we will display based on wheather 'jobDescription' field of recruiterSchema is null or not
        5. 'Add JD' button will open up a form to add all the fields of 'jobDescription' (addFields controller)
        6. Beside each of the field of JD, we will have a button to edit that field (editFields controller)
        7. On clicking 'Remove JD', we will remove the entire 'jobDescription' (deleteFields controller)
    */

    return (
        <StyledRecruiter>
            <GoToFeed onClick={() => navigate('/feed')}>
                <img src='/goBack.svg' alt="back" />
                <span>Feed</span>
            </GoToFeed>
            <ZerothRow>
                <ZerothRowDiv>
                    <Heading>{name}</Heading>
                    <p>{authUser.user.email}</p>
                    <p style={{ textShadow: "0 0 5px #fff,0 0 10px #fff,0 0 20px #fff,0 0 40px #00a89b,0 0 80px #00a89b,0 0 90px #00a89b,0 0 100px #00a89b,0 0 150px #00a89b" }}>[{authUser.user.role[0].toUpperCase() + authUser.user.role.substring(1)}]</p>
                </ZerothRowDiv>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-start" }}>
                    <Heading style={{color: "#de587c"}}>Edit Profile</Heading>
                </div>
            </ZerothRow>

            <Hr></Hr>

            <FirstRow>
                <div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <SectionHeading>Preference: </SectionHeading>
                        <span>{preference}</span>
                        <span style={{ cursor: "pointer", marginLeft: "1rem" }} onClick={handlePreferenceForm}>&#9998;</span>
                    </div>
                    {preferenceForm && <div>
                        <Select id="jobSelect" value={preference} onChange={handlePreferenceSubmit}>
                            <option value="UI/UX designer">UI/UX designer</option>
                            <option value="Cloud Engineer">Cloud Engineer</option>
                            <option value="Network Security">Network Security</option>
                            <option value="Consultant/Analyst">Consultant/Analyst</option>
                            <option value="Software Developer">Software Developer</option>
                            <option value="Front-end Engineer">Front-end Engineer</option>
                            <option value="Backend Engineer">Backend Engineer</option>
                            <option value="Full-stack Engineer">Full-stack Engineer</option>
                            <option value="Data Scientist">Data Scientist</option>
                            <option value="AI/ML Engineer">AI/ML Engineer</option>
                            <option value="Database Administrator">Database Administrator</option>
                            <option value="Embedded Software Engineer">Embedded Software Engineer</option>
                            <option value="Blog/content writing">Blog/content writing</option>
                            <option value="Financial Analyst">Financial Analyst</option>
                            <option value="Photo/Video Editor">Photo/Video Editor</option>
                        </Select>
                    </div>}
                </div>
            </FirstRow>

            <Hr></Hr>

            <Grid2Col>
                <SectionHeading>About/Bio: </SectionHeading>
                <div>
                    <SectionData>
                        <p>{bio}</p>
                        <EditTrash>
                            <img src='/edit.svg' alt="edit" onClick={handleBioForm} />
                        </EditTrash>
                    </SectionData>
                    
                    {bioForm && <TextAreaWrapper>
                        <TextArea id="bio" name="bio" rows="4" cols="50" required minLength="50" maxLength="800" placeholder="Write your bio in 50-800 characters" value={bio} onChange={(evt)=>setBio(evt.target.value)}></TextArea>
                        <TextAreaBtn onClick={handleBioSubmit}>Save</TextAreaBtn>
                    </TextAreaWrapper>}
                </div>
            </Grid2Col>

            <Hr></Hr>

            <JD>
                <SectionHeading style={{textAlign: "center", color: "#00a89b", fontWeight: "500", fontSize: "2rem", letterSpacing: "0.5px", lineHeight: "16px", borderBottom: "0px"}}>JOB DESCRIPTION</SectionHeading>

                {jobDescription && <JDdata />}
                {jdForm && <JDform handleJDform={handleJDform} />}

                {jobDescription && <Button onClick={handleRemoveJD} style={{color: "#de587c", border: "2px solid #de587c"}}>Remove Job Description</Button>}
                {!jobDescription && <Button jdForm={jdForm} onClick={handleJDform}>{(!jdForm) ? "Add Job Description" : "Cancel Form"}</Button>}
            </JD>
        </StyledRecruiter>
    );
}

export default RecruiterSetup;
