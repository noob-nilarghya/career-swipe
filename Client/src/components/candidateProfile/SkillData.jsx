import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { removeCandidateService } from "../../services/apiCandidate";
import { useRoleContext } from "../../context/RoleContext";

const SkillItem = styled.div`
    display: inline-block;
    margin: 0.5rem;
    background-color: #d5eaeb;
    width: fit-content;
    padding: 0.5rem 1rem;
    border: 1.5px solid #306f75;
    border-radius: 2rem;
    color: #444;
`;

function SkillData({skill, type}) {
    const {setRoleUser} = useRoleContext();
    const queryClient = useQueryClient(); 

    const { isLoading: removeField, mutate: mutateRemove } = useMutation({
        mutationFn: (userObj) => removeCandidateService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success(`Skill removed successfully`);
            
            queryClient.invalidateQueries({
                queryKey: ['user-candidate']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalCandidate));
            setRoleUser((val) => data.data.finalCandidate);
            window.location.reload();
        },
        onError: (err) => toast.error(err.message)
    });

    const removeSkillHandler= function() { // at index number 'index'
        const obj= {
            type: "skill",
            id: skill._id
        }
        mutateRemove(obj);
    }
    return (
        <SkillItem>
            {(type!=='feedPage') ? 
                <>
                    <span>{skill.name}</span> <span style={{cursor: "pointer"}} onClick={removeSkillHandler}>✖</span> 
                </> :
                <span style={{fontWeight: "500"}}>{skill.name}</span>
            }
        </SkillItem>
    );
}

export default SkillData;
