
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { useRoleContext } from "../../context/RoleContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addRecruiterService } from "../../services/apiRecruiter";
import toast from 'react-hot-toast';

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
`;
const Input = styled.input`
    padding: 0 2rem;
    height: 3.5rem;
    width: 35rem;
    border: 1px solid #223d3e;
    border-radius: 1rem;
    background-color: #f3f5f7;

    &::placeholder{
        color: #727377;
    }

    @media (max-width: 405px) {
        width: 100%;
    }
`;
const Select = styled.select`
    height: 3rem;
    border-radius: 1rem;
`;

const FormRow = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0.8rem;

  padding: 0.3rem 0;

  &:first-child {
    padding-top: 0;
  }
`;
const Error = styled.span`
  font-size: 1.4rem;
  color: #de587c;
`;
const Button = styled.button`
    width: fit-content;
    bottom: 10px;
    right: 10px;

    background-color: #008BDC;
    color: #fff;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
`;
const FormRowDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 3rem;

    @media (max-width: 330px) {
        flex-direction: column;
        gap: 1rem;
    }
`;
const FormRowDivSalary= styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    align-items: center;

    @media (max-width: 405px) {
        flex-direction: column;
    }
`
const TextArea = styled.textarea`
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    &::placeholder{
        text-align: center;
    }
`;

function JDform({handleJDform}) {
    const { handleSubmit, control, watch, formState } = useForm();
    const { errors } = formState;
    const jobTerms = watch('jobTerms');
    const {roleUser, setRoleUser}= useRoleContext();

    const queryClient= useQueryClient();
    const {isLoading, mutate}= useMutation({
        mutationFn: (obj) => addRecruiterService(obj),
        onSuccess: (data) => {
            toast.success("Job Description added successfully");

            queryClient.invalidateQueries({
                queryKey: ['user-recruiter']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalRecruiter));
            setRoleUser((val) => data.data.finalRecruiter);
            window.location.reload();
        },
        onError: (err) => toast.error(err.message)
    });

    function myOwnSubmitFn(data) {
        let obj= {
            type: "jd",
            company: data.companyName,
            jobRole: data.jobRole,
            location: data.jobLocation,
            terms: data.jobTerms,
            salary: Number(data.salary),
            salaryType: data.salaryType,
            aboutCompany: data.aboutCompany,
            aboutRole: data.aboutJobRole,
            responsibilities: (data.jobResponsibilities) ? data.jobResponsibilities : "",
            requirements: (data.requirements) ? data.requirements : "",
            applyLink: (data.applyLink) ? data.applyLink : '',
        }
        if(data.jobTerms != 'Full time'){
            obj= {
                ...obj,
                duration: Number(data.jobDuration),
                durationType: data.durationType
            }
        }
        if(data.activeTill){
            obj= {
                ...obj,
                activeTill: data.activeTill
            }
        }
        mutate(obj);
        reset();
        handleJDform();
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }
    console.log(jobTerms);

    return (
        <StyledForm onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
            <FormRow>
                <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="&#42;Company Name" type="text" />}
                />
                {errors.companyName && <Error>Company Name is required</Error>}
            </FormRow>
            <FormRow>
                <Controller
                    name="jobRole"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="&#42;Job Role" type="text" />}
                />
                {errors.jobRole && <Error>Job Role is required</Error>}
            </FormRow>
            <FormRow>
                <Controller
                    name="jobLocation"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="&#42;Job Location" type="text" />}
                />
                {errors.jobLocation && <Error>Job Location is required</Error>}
            </FormRow>
            <FormRow>
                <FormRowDiv>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                        <label>Job Terms</label>
                        <Controller
                            name="jobTerms"
                            control={control}
                            defaultValue="Full time" // Set default value here
                            render={({ field }) => (
                                <Select {...field}>
                                    <option value="Full time" selected>Full time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contractual">Contractual</option>
                                </Select>
                            )}
                        />
                    </div>
                    {((jobTerms) && (jobTerms !== 'Full time')) && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                            <label>Job Duration</label>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <Controller
                                    name="jobDuration"
                                    control={control}
                                    render={({ field }) => <Input placeholder="1&#42;" style={{ width: "8rem", height: "3rem" }} {...field} type="number" />}
                                />
                                <Controller
                                    name="durationType"
                                    control={control}
                                    defaultValue="Month"
                                    render={({ field }) => (
                                        <Select {...field}>
                                            <option value="Month">Month</option>
                                            <option value="Year">Year</option>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    )}
                </FormRowDiv>
            </FormRow>
            <FormRow>
                <FormRowDivSalary>
                    <label>Salary (in Rs): </label>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
                        <Controller
                            name="salary"
                            control={control}
                            render={({ field }) => <Input placeholder="(in Rs)&#42;" style={{ width: "12rem" }} {...field} type="number" />}
                        />
                        <Controller
                            name="salaryType"
                            control={control}
                            defaultValue="Per Month"
                            render={({ field }) => (
                                <Select {...field}>
                                    <option value="Per Hour">Per Hour</option>
                                    <option value="Per Day">Per Day</option>
                                    <option value="Per Month">Per Month</option>
                                    <option value="Per Annum">Per Annum</option>
                                </Select>
                            )}
                        />
                    </div>
                </FormRowDivSalary>
            </FormRow>
            <FormRow>
                <Controller
                    name="aboutCompany"
                    control={control}
                    render={({ field }) => <TextArea rows="4" cols="50" required minLength="50" maxLength="600" placeholder="&#42;Write about company in 50-600 characters" {...field} />}
                />
                {errors.aboutCompany && <Error>About company information is required</Error>}
            </FormRow>
            <FormRow>
                <Controller
                    name="aboutJobRole"
                    control={control}
                    render={({ field }) => <TextArea rows="4" cols="50" required minLength="50" maxLength="600" placeholder="&#42;Write about Job Role in 50-600 characters" {...field} />}
                />
                {errors.aboutJobRole && <Error>Job Role Description is required</Error>}
            </FormRow>
            <FormRow>
                <Controller
                    name="jobResponsibilities"
                    control={control}
                    render={({ field }) => <TextArea rows="4" cols="50" required minLength="50" placeholder="&#42;Write about Job Responsibility. Write each points on new line" {...field} />}
                />
                {errors.jobResponsibilities && <Error>Description of Job Responsibility is required</Error>}
            </FormRow>
            <FormRow>
                <Controller
                    name="requirements"
                    control={control}
                    render={({ field }) => <TextArea rows="4" cols="50" placeholder="Write about additional Requirements from Candidate [OPTIONAL]" {...field} />}
                />
            </FormRow>
            <FormRow>
                <Controller
                    name="applyLink"
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="Link to apply" type="text" />}
                />
            </FormRow>
            <FormRow>
                <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                    <label>Active Till</label>
                    <Controller
                        name="activeTill"
                        control={control}
                        render={({ field }) => <Input {...field} style={{ width: "18rem" }} type="date" />}
                    />
                </div>
            </FormRow>
            <p style={{color: "#de587c", textAlign: "center"}}>Note: No changes allowed for Job Terms and Job Duration once you submit</p>
            <FormRow>
                <Button disabled={isLoading}>Submit</Button>
            </FormRow>
        </StyledForm>
    );
}
/*
1. An input of type text asking for company name
2.An input of type text asking for job role
3.An input of type text asking for location
4.A select-option with label Job Terms containing three options: 'Full Time', 'Internship', 'contractual'
5.If user choose any option from job terms except 'Full time', show another input of type number asking for job duration, and select-option for duration type containing two options 'months' and 'years' 
6.An input of type number asking for salary
7. Three checkbox for salary type containing 4 options 'Per Hour' ,'Per Day', 'Per Month', 'Per Annum'
8. A textarea for about company
9. A textarea for about job role
10. A textarea asking for job responsibilities
11. A textarea asking for requirements from candidate
12. An input of type string asking for job apply link
13. An input of type date asking for active till date
*/

export default JDform;
