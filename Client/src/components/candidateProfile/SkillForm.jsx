
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { addCandidateService } from "../../services/apiCandidate";
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
    width: 40rem;
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

function SkillForm({handleSkillForm}) {
    const { register, handleSubmit, reset, getValues, formState } = useForm();
    const { errors } = formState;
    const {setRoleUser} = useRoleContext();

    const queryClient = useQueryClient(); 
    const { isLoading: addField, mutate: mutateAdd } = useMutation({
        mutationFn: (userObj) => addCandidateService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success("Skill added successfully");
            
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
        console.log(data);
        const obj= {
            type: "skill",
            name: data.skillName
        }
        mutateAdd(obj);
        reset();
        handleSkillForm();
    }

    function myOwnError(err) {
        console.log(err); // same as [const {errors} = formState();]
    }

    return (
        <Form onSubmit={handleSubmit(myOwnSubmitFn, myOwnError)}>
            <FormRow>
                <Input
                    type='text'
                    id='skillName'
                    placeholder="&#42;Skill Name"
                    {...register('skillName', {required: 'This field is required'})}
                />
                {errors?.skillName?.message && <Error>{errors.skillName.message}</Error>}
            </FormRow>
            <Button disabled={addField}>Save</Button>
        </Form>
    );
}

export default SkillForm;


