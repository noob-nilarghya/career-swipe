import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { addCandidateService, editCandidateService } from "../../services/apiCandidate";
import { useRoleContext } from "../../context/RoleContext";

const Form= styled.form`
    border: 1px solid black;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
    position: relative;
`;

const Input= styled.input`
    padding: 0 2rem;
    height: 3.5rem;
    width: 35rem;
    border: 1px solid #223d3e;
    border-radius: 1rem;
    background-color: #f3f5f7;

    &::placeholder{
        color: #727377;
    }

    @media (max-width: 500px) {
        width: 90%;
        padding: 0 1rem;
    }
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

    @media (max-width: 500px) {
        align-items: flex-start;
        width: 100%;
    }
`;
const FormRowDiv= styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;

    @media (max-width: 500px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;
const Error = styled.span`
  font-size: 1.4rem;
  color: #de587c;
`;
const Button= styled.button`
    width: fit-content;
    position: absolute;
    bottom: 10px;
    right: 10px;

    background-color: #008BDC;
    color: #fff;
    border-radius: 0.5rem;
    padding: 0 0.5rem;
    border: none;
`;

function EducationForm({handleEducationForm, education, purpose}) {
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;
    const {setRoleUser} = useRoleContext();

    // name, degree, major, cgpa, from, to
    const name= (education) ? education.name : ""; const cgpa= (education) ? education.cgpa : ""; 
    const degree= (education) ? education.degree : ""; const major= (education) ? education.major : ""; 
    const from= (education) ? education.from : ""; const to= (education) ? education.to : ""; const id= (education) ? education._id : "";

    const queryClient = useQueryClient(); 
    const { isLoading: addField, mutate: mutateAdd } = useMutation({
        mutationFn: (userObj) => addCandidateService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("Education added successfully");
            
            queryClient.invalidateQueries({
                queryKey: ['user-candidate']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalCandidate));
            setRoleUser((val) => data.data.finalCandidate);
            window.location.reload();
        },
        onError: (err) => toast.error(err.message)
    });


    const { isLoading: editField, mutate: mutateEdit } = useMutation({
        mutationFn: (userObj) => editCandidateService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("Education edited successfully");
            
            queryClient.invalidateQueries({
                queryKey: ['user-candidate']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalCandidate));
            setRoleUser((val) => data.data.finalCandidate);
            window.location.reload();
        },
        onError: (err) => toast.error(err.message)
    });

    function myOwnSubmitFn(data) {
        if(purpose === 'edit'){
            const obj= {
                id: id,
                type: "education",
                name: data.collegeName,
                degree: data.collegeDegree,
                from: Number(data.collegeStartDate),
                to: Number(data.collegeEndDate),
                major: data.collegeMajor,
                cgpa: Number(data.collegeCGPA)
            }
            mutateEdit(obj);
        }
        else { // add
            const obj= {
                type: "education",
                name: data.collegeName,
                degree: data.collegeDegree,
                from: Number(data.collegeStartDate),
                to: Number(data.collegeEndDate),
                major: data.collegeMajor,
                cgpa: Number(data.collegeCGPA),
            }
            mutateAdd(obj);
            reset();
        }
        handleEducationForm();
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    return (
        <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
            <FormRow>
                <Input
                    type='text'
                    id='collegeName'
                    placeholder="&#42;College Name"
                    defaultValue={name}
                    {...register('collegeName', {required: 'This field is required'})}
                />
                {errors?.collegeName?.message && <Error>{errors.collegeName.message}</Error>}
            </FormRow>

            <FormRow>
                <FormRowDiv>
                    <div>
                        From: &nbsp;
                        <Input
                            style={{width: "13rem"}}
                            type='number'
                            min="1900" max="2099" step="1"
                            id='collegeStartDate'
                            placeholder="&#42;Start Year"
                            defaultValue={from}
                            {...register('collegeStartDate', {required: 'This field is required'})}
                        />
                        &nbsp;
                    </div>
                    <div>
                        To: &nbsp;
                        <Input
                            style={{width: "13rem"}}
                            type='number'
                            min="1900" max="2099" step="1"
                            id='collegeEndDate'
                            placeholder="&#42;End Year"
                            defaultValue={to}
                            {...register('collegeEndDate', {
                                required: 'This field is required',
                                validate: (value) => Number(getValues().collegeStartDate) <= Number(value) || "Start year can't be more than End year",
                            })}
                        />
                    </div>
                </FormRowDiv>
                {(errors?.collegeStartDate?.message) && <Error>{errors.collegeStartDate.message}</Error>}
                {(errors?.collegeEndDate?.message) && <Error>{errors.collegeEndDate.message}</Error>}
            </FormRow>
            <FormRow>
                <FormRowDiv>
                    <div>
                        Degree: &nbsp;
                        <Input
                            style={{width: "10rem"}}
                            type='text'
                            id='collegeDegree'
                            placeholder="&#42;e.g. B.E."
                            defaultValue={degree}
                            {...register('collegeDegree', {required: 'This field is required'})}
                        />
                        &nbsp;
                    </div>
                    <div>
                        CGPA: &nbsp;
                        <Input
                            style={{width: "12rem"}}
                            type='text'
                            id='collegeCGPA'
                            placeholder="&#42;e.g. 8.54"
                            defaultValue={cgpa}
                            {...register('collegeCGPA', {required: 'This field is required'})}
                        />
                    </div>
                </FormRowDiv>
                {errors?.collegeDegree?.message && <Error>{errors.collegeDegree.message}</Error>}
                {errors?.collegeCGPA?.message && <Error>{errors.collegeCGPA.message}</Error>}
            </FormRow>

            <FormRow>
                <Input
                    type='text'
                    id='collegeMajor'
                    placeholder="&#42;Department / Major"
                    defaultValue={major}
                    {...register('collegeMajor', {required: 'This field is required'})}
                />
                {errors?.collegeMajor?.message && <Error>{errors.collegeMajor.message}</Error>}
            </FormRow>
            <Button disabled={addField || editField}>Save</Button>
        </Form>
    );
}

export default EducationForm;
