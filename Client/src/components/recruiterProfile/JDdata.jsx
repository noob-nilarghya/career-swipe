
import styled from "styled-components";
import { useRoleContext } from "../../context/RoleContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { editRecruiterService } from "../../services/apiRecruiter";
import toast from 'react-hot-toast';
import { useState } from "react";
import formatDate from "../../utils/dateFormatter";

const StyledJDdata = styled.div`
    display: flex;
    flex-direction: column;
`;
const Row0 = styled.div`
    display: flex;
    gap: 1.5rem;
    align-self: center;
    padding-right: 2rem;
    padding: 1rem 0 2rem 0;
    &>div{
        background-color: #d9d9d9;
        color: #606060;
        padding: 0.3rem 0.6rem;
        border-radius: 2rem;
        margin-bottom: 0.5rem;
    }

    @media (max-width: 500px){
        flex-direction: column;
    }
`;
const DisplayRow = styled.div`
    padding: 0.5rem 0;
    display: flex;
    justify-content: center;
    gap: 5rem;

    @media (max-width: 700px) {
        flex-direction: column;
        gap: 1rem;
        align-items: center;
    }
    @media (max-width: 450px){
        align-items: flex-start;
    }
`;
const SectionHeading = styled.p`
    font-weight: 500;
    line-height: 16px;
    letter-spacing: .5px;

    @media (max-width: 650px){
        text-decoration: underline;
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
const SectionData = styled.div`
    display: grid;
    grid-template-columns: 1fr 10rem;

    @media (max-width: 850px) {
        grid-template-columns: 1fr 2rem;
        column-gap: 1rem;
    }
`;
const EditTrash = styled.div`
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
const TextAreaWrapper = styled.div`
    padding-top: 1.5rem;
    display: flex;
    gap: 1rem;

    @media (max-width: 500px) {
        position: relative;
    }

    @media (max-width: 380px) {
        width: 95%;
        justify-content: center;
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
    background-color: #008BDC;
    color: #fff;

    @media (max-width: 500px) {
        position: ${(props)=> (props.purpose === 'applyLink') ? "relative" : "absolute"};
        right: 0.5rem;
        bottom: 0.5rem;
        filter: opacity(0.8);
    }
`;
const Button = styled.button`
    color: #008BDC;
    width: fit-content;
    background: none;
    border: none;
    align-self: center;
    margin: 1rem 0;
`;
const InputWrapper = styled.div`
    padding: 0.3rem 0;
    display: flex;
    align-items: center;
    @media (max-width: 500px) {
        width: 100%;
    }
`;
const Input = styled.input`
    padding: 0 2rem;
    height: 3.5rem;
    width: 35rem;
    border: 1px solid #223d3e;
    border-radius: 1rem;
    background-color: #f3f5f7;
    margin-right: 1rem;

    &::placeholder{
        color: #727377;
    }

    @media (max-width: 500px) {
        width: 70%;
        padding: 0 1rem;
    }
`;


function JDdata() {
    const { roleUser, setRoleUser } = useRoleContext();

    const [aboutCompany, setAboutCompany] = useState(roleUser.jobDescription.aboutCompany);
    const [aboutJobRole, setAboutJobRole] = useState(roleUser.jobDescription.aboutRole);
    const [responsibilities, setResponsibilities] = useState(roleUser.jobDescription.responsibilities);
    const [requirements, setRequirements] = useState(roleUser.jobDescription.requirements || "");
    const [applyLink, setApplyLink] = useState(roleUser.jobDescription.applyLink || "");
    const [company, setCompany] = useState(roleUser.jobDescription.company);
    const [jobRole, setJobRole] = useState(roleUser.jobDescription.jobRole);
    const [jobLocation, setJobLocation] = useState(roleUser.jobDescription.location);
    const [salary, setSalary] = useState(roleUser.jobDescription.salary);
    const [salaryType, setSalaryType] = useState(roleUser.jobDescription.salaryType);


    const [openReqForm, setOpenReqForm] = useState(false);
    const [openApplyForm, setOpenApplyForm] = useState(false);

    const [aboutCompanyForm, setAboutCompanyForm] = useState(false);
    const handleAboutCompanyForm = () => {
        setAboutCompanyForm((aboutCompanyForm) => !aboutCompanyForm);
    }

    const [aboutJobRoleForm, setAboutJobRoleForm] = useState(false);
    const handleAboutJobRoleForm = () => {
        setAboutJobRoleForm((aboutJobRoleForm) => !aboutJobRoleForm);
    }

    const [responsibilitiesForm, setResponsibilitiesForm] = useState(false);
    const handleResponsibilitiesForm = () => {
        setResponsibilitiesForm((responsibilitiesForm) => !responsibilitiesForm);
    }

    const [requirementsForm, setRequirementsForm] = useState(false);
    const handleRequirementsForm = () => {
        setRequirementsForm((requirementsForm) => !requirementsForm);
    }

    const [applyLinkForm, setApplyLinkForm] = useState(false);
    const handleApplyLinkForm = () => {
        setApplyLinkForm((applyLinkForm) => !applyLinkForm);
    }

    const [companyForm, setCompanyForm] = useState(false);
    const handleCompanyForm = function () {
        setCompanyForm((isOpen) => !isOpen);
    }

    const [jobRoleForm, setJobRoleForm] = useState(false);
    const handleJobRoleForm = function () {
        setJobRoleForm((isOpen) => !isOpen);
    }

    const [jobLocationForm, setJobLocationForm] = useState(false);
    const handleJobLocationForm = function () {
        setJobLocationForm((isOpen) => !isOpen);
    }

    const [salaryForm, setSalaryForm] = useState(false);
    const handleSalaryForm = function () {
        setSalaryForm((isOpen) => !isOpen);
    }

    const queryClient = useQueryClient();
    const { isLoading, mutate } = useMutation({
        mutationFn: (obj) => editRecruiterService(obj),
        onSuccess: (data) => {
            toast.success("Job Description edited successfully");

            queryClient.invalidateQueries({
                queryKey: ['user-recruiter']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalRecruiter));
            setRoleUser((val) => data.data.finalRecruiter);
        },
        onError: (err) => toast.error(err.message)
    });

    const handleAboutCompanySubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            aboutCompany: aboutCompany
        }
        mutate(obj);
        handleAboutCompanyForm();
    }

    const handleAboutJobRoleSubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            aboutRole: aboutJobRole
        }
        mutate(obj);
        handleAboutJobRoleForm();
    }

    const handleResponsibilitiesSubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            responsibilities: responsibilities
        }
        mutate(obj);
        handleResponsibilitiesForm();
    }

    const handleRequirementsSubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            requirements: requirements
        }
        mutate(obj);
        handleRequirementsForm();
    }

    const AddRequirementsSubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            requirements: requirements
        }
        mutate(obj);
        setOpenReqForm((val) => !val);
    }

    const handleApplyLinkSubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            applyLink: applyLink
        }
        mutate(obj);
        handleApplyLinkForm();
    }

    const AddApplyLinkSubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            applyLink: applyLink
        }
        mutate(obj);
        setOpenApplyForm((val) => !val);
    }

    const handleCompanySubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            company: company
        }
        mutate(obj);
        handleCompanyForm();
    }

    const handleJobRoleSubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            jobRole: jobRole
        }
        mutate(obj);
        handleJobRoleForm();
    }

    const handleJobLocationSubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            location: jobLocation
        }
        mutate(obj);
        handleJobLocationForm();
    }

    const handleSalarySubmit = function () {
        const obj = {
            id: roleUser.jobDescription._id,
            type: "jd",
            salary: salary,
            salaryType: salaryType
        }
        mutate(obj);
        handleSalaryForm();
    }


    return (
        <StyledJDdata>
            <Row0>
                <div><span>Posted on: </span> <span>{formatDate(roleUser.jobDescription.createdAt)}</span></div>
                {roleUser.jobDescription.activeTill && <div><span>Active till: </span> <span>{formatDate(roleUser.jobDescription.activeTill)}</span></div>}
            </Row0>
            <DisplayRow>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <SectionHeading>Company: </SectionHeading>
                        <span>{company}</span>
                        <span style={{ cursor: "pointer", marginLeft: "1rem" }} onClick={handleCompanyForm}>&#9998;</span>
                    </div>
                    {companyForm && <div>
                        <input style={{ borderRadius: "0.5rem", border: "1px solid black", padding: "0.2rem 1rem", width: "15rem" }} type="text" id="company" name="company" value={company} onChange={(evt) => setCompany(evt.target.value)} />
                        <button onClick={handleCompanySubmit} style={{ marginLeft: "0.5rem", padding: "0 0.5rem" }}>✔</button>
                    </div>}
                </div>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <SectionHeading>Title: </SectionHeading>
                        <span>{jobRole}</span>
                        <span style={{ cursor: "pointer", marginLeft: "1rem" }} onClick={handleJobRoleForm}>&#9998;</span>
                    </div>
                    {jobRoleForm && <div>
                        <input style={{ borderRadius: "0.5rem", border: "1px solid black", padding: "0.2rem 1rem", width: "24rem" }} type="text" id="jobRole" name="jobRole" value={jobRole} onChange={(evt) => setJobRole(evt.target.value)} />
                        <button onClick={handleJobRoleSubmit} style={{ marginLeft: "0.5rem", padding: "0 0.5rem" }}>✔</button>
                    </div>}
                </div>
            </DisplayRow>
            <DisplayRow>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <SectionHeading>Job Location: </SectionHeading>
                        <span>{jobLocation}</span>
                        <span style={{ cursor: "pointer", marginLeft: "1rem" }} onClick={handleJobLocationForm}>&#9998;</span>
                    </div>
                    {jobLocationForm && <div>
                        <input style={{ borderRadius: "0.5rem", border: "1px solid black", padding: "0.2rem 1rem", width: "24rem" }} type="text" id="jobLocation" name="jobLocation" value={jobLocation} onChange={(evt) => setJobLocation(evt.target.value)} />
                        <button onClick={handleJobLocationSubmit} style={{ marginLeft: "0.5rem", padding: "0 0.5rem" }}>✔</button>
                    </div>}
                </div>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <SectionHeading>Salary: </SectionHeading>
                        <span>{roleUser.jobDescription.salary} Rs {roleUser.jobDescription.salaryType}</span>
                        <span style={{ cursor: "pointer", marginLeft: "1rem" }} onClick={handleSalaryForm}>&#9998;</span>
                    </div>
                    {salaryForm && <div>
                        <input style={{ borderRadius: "0.5rem", border: "1px solid black", padding: "0.2rem 1rem", width: "10rem", marginRight: "1rem" }} type="text" id="salary" name="salary" value={salary} onChange={(evt) => setSalary(evt.target.value)} />
                        <select id="salaryType" value={salaryType} onChange={(evt) => setSalaryType(evt.target.value)}>
                            <option value="Per Hour">Per Hour</option>
                            <option value="Per Day">Per Day</option>
                            <option value="Per Month">Per Month</option>
                            <option value="Per Annum">Per Annum</option>
                        </select>
                        <button onClick={handleSalarySubmit} style={{ marginLeft: "0.5rem", padding: "0 0.5rem" }}>✔</button>
                    </div>}
                </div>
            </DisplayRow>
            <DisplayRow>
                {(roleUser.jobDescription.terms === 'Full time') && (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <SectionHeading>Terms: </SectionHeading> <span>{roleUser.jobDescription.terms} (FTE role)</span>
                    </div>
                )}
                {(roleUser.jobDescription.terms !== 'Full time') && (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <SectionHeading>Terms: </SectionHeading> <span>{roleUser.jobDescription.terms}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <SectionHeading>Duration: </SectionHeading> <span>{roleUser.jobDescription.duration} {roleUser.jobDescription.durationType}</span>
                        </div>
                    </>
                )}
            </DisplayRow>

            <Grid2Col>
                <SectionHeading>About Company : </SectionHeading>
                <div>
                    <SectionData>
                        <p>{aboutCompany}</p>
                        <EditTrash>
                            <img src='/edit.svg' alt="edit" onClick={handleAboutCompanyForm} />
                        </EditTrash>
                    </SectionData>

                    {aboutCompanyForm && <TextAreaWrapper>
                        <TextArea id="bio" name="bio" rows="4" cols="50" required minLength="50" maxLength="600" placeholder="&#42;Write about company in 50-600 characters" value={aboutCompany} onChange={(evt) => setAboutCompany(evt.target.value)}></TextArea>
                        <TextAreaBtn onClick={handleAboutCompanySubmit}>Save</TextAreaBtn>
                    </TextAreaWrapper>}
                </div>
            </Grid2Col>

            <Grid2Col>
                <SectionHeading>About Job Role : </SectionHeading>
                <div>
                    <SectionData>
                        <p>{aboutJobRole}</p>
                        <EditTrash>
                            <img src='/edit.svg' alt="edit" onClick={handleAboutJobRoleForm} />
                        </EditTrash>
                    </SectionData>

                    {aboutJobRoleForm && <TextAreaWrapper>
                        <TextArea id="bio" name="bio" rows="4" cols="50" required minLength="50" maxLength="600" placeholder="&#42;Write about Job Role in 50-600 characters" value={aboutJobRole} onChange={(evt) => setAboutJobRole(evt.target.value)}></TextArea>
                        <TextAreaBtn onClick={handleAboutJobRoleSubmit}>Save</TextAreaBtn>
                    </TextAreaWrapper>}
                </div>
            </Grid2Col>

            <Grid2Col>
                <SectionHeading>Responsibilities : </SectionHeading>
                <div>
                    <SectionData>
                        <div>
                            {responsibilities.split('\n').map((responsibility, index) => (
                                <div style={{ display: "flex", gap: "0.5rem" }} key={index}>
                                    <span>&#9654;</span> <p>{responsibility}</p>
                                </div>
                            ))}
                        </div>
                        <EditTrash>
                            <img src='/edit.svg' alt="edit" onClick={handleResponsibilitiesForm} />
                        </EditTrash>
                    </SectionData>

                    {responsibilitiesForm && <TextAreaWrapper>
                        <TextArea id="bio" name="bio" rows="4" cols="50" required minLength="50" placeholder="&#42;Write about Job Responsibility. Write each points on new line" value={responsibilities} onChange={(evt) => setResponsibilities(evt.target.value)}></TextArea>
                        <TextAreaBtn onClick={handleResponsibilitiesSubmit}>Save</TextAreaBtn>
                    </TextAreaWrapper>}
                </div>
            </Grid2Col>

            {(roleUser.jobDescription.requirements && roleUser.jobDescription.requirements !== '') && (
                <Grid2Col>
                    <SectionHeading>Additional Requirements : </SectionHeading>
                    <div>
                        <SectionData>
                            <div>
                                {requirements.split('\n').map((requirement, index) => (
                                    <div style={{ display: "flex", gap: "0.5rem" }} key={index}>
                                        <span>&#9654;</span> <p>{requirement}</p>
                                    </div>
                                ))}
                            </div>
                            <EditTrash>
                                <img src='/edit.svg' alt="edit" onClick={handleRequirementsForm} />
                            </EditTrash>
                        </SectionData>

                        {requirementsForm && <TextAreaWrapper>
                            <TextArea id="bio" name="bio" rows="4" cols="50" placeholder="Write about additional Requirements from Candidate [OPTIONAL]" value={requirements} onChange={(evt) => setRequirements(evt.target.value)}></TextArea>
                            <TextAreaBtn onClick={handleRequirementsSubmit}>Save</TextAreaBtn>
                        </TextAreaWrapper>}
                    </div>
                </Grid2Col>
            )}

            {openReqForm && (
                <Grid2Col>
                    <SectionHeading>Additional Requirements : </SectionHeading>
                    <TextAreaWrapper>
                        <TextArea id="bio" name="bio" rows="4" cols="50" placeholder="Write about additional Requirements from Candidate [OPTIONAL]" value={requirements} onChange={(evt) => setRequirements(evt.target.value)}></TextArea>
                        <TextAreaBtn onClick={AddRequirementsSubmit}>Save</TextAreaBtn>
                    </TextAreaWrapper>
                </Grid2Col>
            )}
            {(!roleUser.jobDescription.requirements || roleUser.jobDescription.requirements === '') && (
                <Button onClick={() => setOpenReqForm((val) => !val)}>{(openReqForm) ? "- Close" : "+ Add Additional Requirements (if any)"}</Button>
            )}

            {(roleUser.jobDescription.applyLink && roleUser.jobDescription.applyLink !== '') && (
                <Grid2Col>
                    <SectionHeading>Apply Link: </SectionHeading>
                    <div>
                        <SectionData>
                            <a href={roleUser.jobDescription.applyLink} target="_blank">{roleUser.jobDescription.applyLink}</a>
                            <EditTrash>
                                <img src='/edit.svg' alt="edit" onClick={handleApplyLinkForm} />
                            </EditTrash>
                        </SectionData>
                        {applyLinkForm && <InputWrapper>
                            <Input type="text" value={applyLink} onChange={(evt) => setApplyLink(evt.target.value)}></Input>
                            <TextAreaBtn purpose="applyLink" onClick={handleApplyLinkSubmit}>Save</TextAreaBtn>
                        </InputWrapper>}
                    </div>
                </Grid2Col>
            )}
            {openApplyForm && (
                <Grid2Col>
                    <SectionHeading>Apply Link: </SectionHeading>
                    <InputWrapper>
                        <Input type="text" value={applyLink} onChange={(evt) => setApplyLink(evt.target.value)} placeholder="Enter job apply link"></Input>
                        <TextAreaBtn purpose="applyLink" onClick={AddApplyLinkSubmit}>Save</TextAreaBtn>
                    </InputWrapper>
                </Grid2Col>
            )}
            {(!roleUser.jobDescription.applyLink || roleUser.jobDescription.applyLink === '') && (
                <Button onClick={() => setOpenApplyForm((val) => !val)}>{(openApplyForm) ? "- Close" : "+ Add Apply Link (if required)"}</Button>
            )}
        </StyledJDdata>
    );
}

export default JDdata;
