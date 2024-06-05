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

function CompanyForm({handleCompanyForm, company, purpose}) {
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;
    const {setRoleUser} = useRoleContext();
    // if purpose is 'edit' -> company is companies[index], edit the form content at 'index', and update backend

    // name, role, from, to, about
    const name= (company) ? company.name : ""; const role= (company) ? company.role : "";
    const from= (company) ? company.from : ""; const to= (company) ? (company.to === 2099 ? "" : company.to) : ""; 
    const about= (company) ? company.description : ""; const id= (company) ? company._id : "";

    const queryClient = useQueryClient(); 
    const { isLoading: addField, mutate: mutateAdd } = useMutation({
        mutationFn: (userObj) => addCandidateService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("Company added successfully");
            
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
            toast.success("Company edited successfully");
            
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
                type: "company",
                id: id,
                name: data.companyName,
                from: Number(data.companyStartDate),
                to: (!data.companyEndDate) ? 2099 : Number(data.companyEndDate),
                role: data.companyRole,
                description: data.companyAbout
            }
            mutateEdit(obj);
        }
        else{ // add
            const obj= {
                type: "company",
                name: data.companyName,
                from: Number(data.companyStartDate),
                to: (!data.companyEndDate) ? 2099 : Number(data.companyEndDate),
                role: data.companyRole,
                description: data.companyAbout
            }
            mutateAdd(obj);
            reset();
        }
        handleCompanyForm();
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    return (
        <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
            <FormRow>
                <Input
                    type='text'
                    id='companyName'
                    placeholder="&#42;Company Name"
                    defaultValue={name}
                    {...register('companyName', {required: 'This field is required'})}
                />
                {errors?.companyName?.message && <Error>{errors.companyName.message}</Error>}
            </FormRow>

            <FormRow>
                <FormRowDiv>
                    <div>
                        From: &nbsp;
                        <Input
                            style={{width: "13rem"}}
                            type='number'
                            min="1900" max="2099" step="1"
                            id='companyStartDate'
                            placeholder="*Start Year"
                            defaultValue={from}
                            {...register('companyStartDate', {required: 'This field is required'})}
                        />
                        &nbsp;
                    </div>
                    <div>
                        To: &nbsp;
                        <Input
                            style={{width: "13rem"}}
                            type='number'
                            min="1900" max="2099" step="1"
                            id='companyEndDate'
                            placeholder="End Year"
                            defaultValue={to}
                            {...register('companyEndDate', {
                                validate: (value) => (value) ? (Number(getValues().companyStartDate) <= Number(value) || "Start year can't be more than End year") : true,
                            })}
                        />
                    </div>
                </FormRowDiv>
                {errors?.companyStartDate?.message && <Error>{errors.companyStartDate.message}</Error>}
                {errors?.companyEndDate?.message && <Error>{errors.companyEndDate.message}</Error>}
            </FormRow>

            <FormRow>
                <Input
                    type='text'
                    id='companyRole'
                    placeholder="*Role/Position"
                    defaultValue={role}
                    {...register('companyRole', {required: 'This field is required'})}
                />
                {errors?.companyRole?.message && <Error>{errors.companyRole.message}</Error>}
            </FormRow>

            <FormRow>
                <Input
                    type='text'
                    id='companyAbout'
                    placeholder="*Work Description"
                    defaultValue={about}
                    {...register('companyAbout', {required: 'This field is required'})}
                />
                {errors?.companyAbout?.message && <Error>{errors.companyAbout.message}</Error>}
            </FormRow>
            <Button disabled={addField || editField}>Save</Button>
        </Form>
    );
}

export default CompanyForm;
