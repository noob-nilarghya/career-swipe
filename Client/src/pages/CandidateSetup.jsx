import { useState } from "react";
import styled from "styled-components";
import EditTrash from "../components/candidateProfile/EditTrash";
import CompanyForm from "../components/candidateProfile/CompanyForm";
import ProjectForm from "../components/candidateProfile/ProjectForm";
import EducationForm from "../components/candidateProfile/EducationForm";
import AchievementForm from "../components/candidateProfile/AchievementForm";
import SkillForm from "../components/candidateProfile/SkillForm";
import CompanyData from "../components/candidateProfile/CompanyData";
import ProjectData from "../components/candidateProfile/ProjectData";
import SkillData from "../components/candidateProfile/SkillData";
import EducationData from "../components/candidateProfile/EducationData";
import AchievementData from "../components/candidateProfile/AchievementData";
import ProfileData from "../components/candidateProfile/ProfileData";
import ProfileForm from "../components/candidateProfile/ProfileForm";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";
import { useRoleContext } from "../context/RoleContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addCandidateService } from "../services/apiCandidate";
import toast from 'react-hot-toast';

const StyledCandidate = styled.div`
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
const ZerothRow= styled.div`
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
        gap: 0.5rem;
        align-items: center;
    }
`
const Hr= styled.hr`
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

    @media (max-width: 850px) {
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }
`;
const TextAreaWrapper = styled.div`
    padding-top: 1.5rem;
    display: flex;
    gap: 1rem;

    @media (max-width: 450px) {
        position: relative;
    }
`;
const TextArea = styled.textarea`
    width: 90%;
    padding: 1rem 2rem;
    resize: none;
    border-radius: 0.5rem;
    @media (max-width: 450px) {
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

    @media (max-width: 450px) {
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
        grid-template-columns: 130px 1fr;
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

    @media (max-width: 650px) {
        text-decoration: underline;
    }
`;
const SectionData= styled.div`
    display: grid;
    grid-template-columns: 1fr 10rem;

    @media (max-width: 850px) {
        grid-template-columns: 1fr 4.5rem;
    }
`;
const Button= styled.button`
    color: #008BDC;
    width: fit-content;
    background: none;
    border: none;
`;
const Heading= styled.p`
    font-Weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
    font-size: 2.5rem; 
    color: #00a89b;
    text-transform: uppercase;
`;
const GoToFeed= styled.div`
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
const ModalButton= styled.button`
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

function CandidateSetup() {
    const navigate= useNavigate();
    const { authUser }= useAuthContext();
    const {roleUser, setRoleUser}= useRoleContext();
    if(!authUser){
        return (
            <Modal isOpen={true}>
                <>
                    <h3>User logged out, Please login again</h3>
                    <ModalButton style={{margin: "0 auto", marginTop: "2rem", color: "black"}} onClick={()=>navigate('/login')}>Login</ModalButton>
                </>
            </Modal>
        );
    }
    // console.log(roleUser); 

    const name= authUser.user.username;
    const [relocate, setRelocate] = useState(roleUser.relocate);
    const [resume, setResume] = useState(roleUser.resumeLink);
    const [bio, setBio] = useState(roleUser.bio);
    const [companies, setCompanies] = useState(roleUser.pastCompanies);
    const [projects, setProjects] = useState(roleUser.projects);
    const [skills, setSkills] = useState(roleUser.skills);
    const [education, setEducation] = useState(roleUser.educations);
    const [achievments, setAchievements] = useState(roleUser.achievements);
    const [profiles, setProfiles] = useState(roleUser.profileLinks);
    const [preference, setPreference] = useState(roleUser.preference);

    // Form open status
    const [resumeForm, setResumeForm] = useState(false);
    const handleResumeForm = function () {
        setResumeForm((val) => !val);
    }

    const [preferenceForm, setPreferenceForm] = useState(false);
    const handlePreferenceForm= function() {
        setPreferenceForm((val)=> !val);
    }

    const [bioForm, setBioForm] = useState(false);
    const handleBioForm = function () {
        setBioForm((val) => !val);
    }

    const [companyForm, setCompanyForm] = useState(false);
    const handleCompanyForm= function() {
        setCompanyForm((val)=> !val);
    }

    const [projectForm, setProjectForm] = useState(false);
    const handleProjectForm= function() {
        setProjectForm((val)=> !val);
    }

    const [educationForm, setEducationForm] = useState(false);
    const handleEducationForm= function() {
        setEducationForm((val)=> !val);
    }

    const [achievementForm, setAchievementForm] = useState(false);
    const handleAchievementForm= function() {
        setAchievementForm((val)=> !val);
    }

    const [skillForm, setSkillForm] = useState(false);
    const handleSkillForm= function() {
        setSkillForm((val)=> !val);
    }

    const [profileForm, setProfileForm] = useState(false);
    const handleProfileForm= function() {
        setProfileForm((val)=> !val);
    }

    const queryClient= useQueryClient();
    const {isLoading, mutate}= useMutation({
        mutationFn: (obj) => addCandidateService(obj),
        onSuccess: (data) => {
            toast.success("Data updated successfully");

            queryClient.invalidateQueries({
                queryKey: ['user-candidate']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalCandidate));
            setRoleUser((val) => data.data.finalCandidate);
        },
        onError: (err) => toast.error(err.message)
    });

    const handleBioSubmit= function() {
        const obj= { type: "default", bio: bio };
        mutate(obj);
        handleBioForm();
    }
    const handleCheckboxChange= function(value) {
        setRelocate(value);
        const obj= { type: "default", relocate: value };
        mutate(obj);
    }
    const handleResumeSubmit= function(){
        const obj= { type: "default", resumeLink: resume };
        mutate(obj);
        handleResumeForm();
    }
    const handlePreferenceSubmit= function(evt){
        const selectedValue = evt.target.value;
        setPreference(selectedValue);
        const obj= {type: "default", preference: selectedValue};
        mutate(obj);
        handlePreferenceForm();
    }
    

    return (
        <StyledCandidate>
            <GoToFeed onClick={()=>navigate('/feed')}>
                <img src='/goBack.svg' alt="back" />
                <span>Feed</span>
            </GoToFeed>
            <ZerothRow>
                <ZerothRowDiv>
                    <Heading>{name}</Heading>
                    <p>{authUser.user.email}</p>
                    <p style={{textShadow:"0 0 5px #fff,0 0 10px #fff,0 0 20px #fff,0 0 40px #00a89b,0 0 80px #00a89b,0 0 90px #00a89b,0 0 100px #00a89b,0 0 150px #00a89b"}}>[{authUser.user.role[0].toUpperCase()+authUser.user.role.substring(1)}]</p>
                </ZerothRowDiv>
                <div style={{display: "flex", gap: "1rem", justifyContent: "flex-start"}}>
                    <Heading style={{color: "#de587c"}}>Edit Profile</Heading>
                </div>
            </ZerothRow>
            <Hr></Hr>
            <FirstRow>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <SectionHeading>Relocate:</SectionHeading>
                    <div>Yes: <input type="checkbox" id="relocateYes" name="relocate" checked={relocate} onChange={() => handleCheckboxChange(true)} /></div>
                    <div>No: <input type="checkbox" id="relocateNo" name="relocate" checked={!relocate} onChange={() => handleCheckboxChange(false)} /></div>
                </div>
                <div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <SectionHeading>Resume: </SectionHeading>
                        <a style={{ textDecoration: "revert", color: "#008BDC" }} href={(resume) ? resume : "#"} target={(resume) ? "_blank" : ""} >Link</a>
                        <span style={{ cursor: "pointer", marginLeft: "1rem" }} onClick={handleResumeForm}>&#9998;</span>
                    </div>
                    {resumeForm && <div>
                        <input style={{ borderRadius: "0.5rem", border: "1px solid black", padding: "0.2rem 1rem", width: "15rem" }} type="text" id="resume" name="resume" value={resume} onChange={(evt)=>setResume(evt.target.value)} />
                        <button onClick={handleResumeSubmit} style={{ marginLeft: "0.5rem", padding: "0 0.5rem" }}>✔</button>
                    </div>}
                </div>
                <div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <SectionHeading>Preference: </SectionHeading>
                        <span>{preference}</span>
                        <span style={{ cursor: "pointer", marginLeft: "1rem" }} onClick={handlePreferenceForm}>&#9998;</span>
                    </div>
                    {preferenceForm && <div>
                        <select id="jobSelect" value={preference} onChange={handlePreferenceSubmit}>
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
                        </select>
                    </div>}
                </div>
            </FirstRow>

            <Hr></Hr>

            <Grid2Col>
                <SectionHeading>About/Bio: </SectionHeading>
                <div>
                    <SectionData>
                        <p style={{ marginLeft: "1rem" }}>{bio}</p>
                        <EditTrash handleEditClick={handleBioForm} section='bio'/>
                    </SectionData>
                    
                    {bioForm && <TextAreaWrapper>
                        <TextArea id="bio" name="bio" rows="4" cols="50" required minLength="50" maxLength="800" placeholder="Write your bio in 800 characters" value={bio} onChange={(evt)=>setBio(evt.target.value)}></TextArea>
                        <TextAreaBtn onClick={handleBioSubmit}>Save</TextAreaBtn>
                    </TextAreaWrapper>}
                </div>
            </Grid2Col>

            <Hr></Hr>
                        
            <Grid2Col>
                <SectionHeading>Past Companies: </SectionHeading>
                <div>
                    {companies.map((company, index) => (
                        <SectionData key={index}>
                            <CompanyData company={company} index={index}/>
                        </SectionData>
                    ))}
                    <Button onClick={handleCompanyForm}>{(companyForm) ? "- Close" : "+ Add Company"}</Button>
                    {companyForm && <CompanyForm handleCompanyForm={handleCompanyForm} purpose="add"/>}

                </div>
            </Grid2Col>

            <Hr></Hr>

            <Grid2Col>
                <SectionHeading>Projects: </SectionHeading>
                <div>
                    {projects.map((project, index) => (
                        <SectionData key={index}>
                            <ProjectData project={project} index={index}/>
                        </SectionData>
                    ))}
                    <Button onClick={handleProjectForm}>{(projectForm) ? "- Close" : "+ Add Project"}</Button>
                    {projectForm && <ProjectForm handleProjectForm={handleProjectForm} purpose="add" />}

                </div>
            </Grid2Col>

            <Hr></Hr>

            <Grid2Col>
                <SectionHeading>Skills: </SectionHeading>
                <div>
                    {skills.map((skill, index) => <SkillData key={index} skill={skill} index={index} />)}
                    <Button style={{marginLeft: "1rem"}} onClick={handleSkillForm}>{(skillForm) ? "- Close" : "+ Add Skill"}</Button>
                    {skillForm && <SkillForm handleSkillForm={handleSkillForm} />}
                </div>
            </Grid2Col>

            <Hr></Hr>

            <Grid2Col>
                <SectionHeading>Education: </SectionHeading>
                <div>
                    {education.map((edu, index) => (
                        <SectionData key={index}>
                            <EducationData education={edu} index={index} />
                        </SectionData>
                    ))}
                    <Button onClick={handleEducationForm}>{(educationForm) ? "- Close" : "+ Add Education"}</Button>
                    {educationForm && <EducationForm handleEducationForm={handleEducationForm} purpose="add" />}
                    
                </div>
            </Grid2Col>

            <Hr></Hr>

            <Grid2Col>
                <SectionHeading>Success Story: </SectionHeading>
                <div>
                    {achievments.map((achievement, index) => (
                        <SectionData key={index}>
                            <AchievementData achievement={achievement} index={index}/>
                        </SectionData>
                    ))}
                    <Button onClick={handleAchievementForm}>{(achievementForm) ? "- Close" : "+ Add Achievement"}</Button>
                    {achievementForm && <AchievementForm handleAchievementForm={handleAchievementForm} purpose="add" />}

                </div>
            </Grid2Col>

            <Hr></Hr>

            <Grid2Col>
                <SectionHeading>Profiles: </SectionHeading>
                <div>
                    {profiles.map((profile, index) => (
                        <SectionData key={index}>
                            <ProfileData profile={profile} index={index} />
                        </SectionData>
                    ))}
                    <Button onClick={handleProfileForm}>{(profileForm) ? "- Close" : "+ Add Profile"}</Button>
                    {profileForm && <ProfileForm handleProfileForm={handleProfileForm} purpose="add" />}
                </div>
            </Grid2Col>

            <Hr></Hr>

            <button style={{padding: "0.5rem 1rem", border: "none", borderRadius: "0.5rem", display: "flex", margin: "1rem auto", background: "#de587c", color: "#fafafa", boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)"}} onClick={()=> navigate('/resume-builder')}>Genreate Resume</button>
        </StyledCandidate>
    );
}

export default CandidateSetup;

