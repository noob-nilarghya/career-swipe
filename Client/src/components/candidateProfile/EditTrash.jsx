import styled from "styled-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import { removeCandidateService } from "../../services/apiCandidate";
import { useRoleContext } from "../../context/RoleContext";

const StyledEditTrash= styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    width: 100%;
    align-items: flex-start;
    padding-top: ${(props)=> (props.section==="achievement" || props.section==='profile') ? "0rem" : "0.8rem"};
`;
const Img= styled.img`
    width: 18%;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover{
        transform: scale(1.05);
    }

    @media (max-width: 850px) {
        width: 40%;
    }
`;

function EditTrash({handleEditClick, section, type, id}) {
    const {setRoleUser} = useRoleContext();
    const queryClient = useQueryClient(); 

    const { isLoading: removeField, mutate: mutateRemove } = useMutation({
        mutationFn: (userObj) => removeCandidateService(userObj), 
        onSuccess: (data) => { // instruction to be performed on success
            toast.success(`${type[0].toUpperCase()+type.substring(1)} removed successfully`);
            
            queryClient.invalidateQueries({
                queryKey: ['user-candidate']
            });

            localStorage.setItem('role-user', JSON.stringify(data.data.finalCandidate));
            setRoleUser((val) => data.data.finalCandidate);
            window.location.reload();
        },
        onError: (err) => toast.error(err.message)
    });

    const handleDelete= function() {
        const obj={
            type: type,
            id: id
        }
        mutateRemove(obj);
    }

    return (
        <StyledEditTrash section={section}>
            <Img src='/edit.svg' alt="edit" onClick={handleEditClick} />
            {section!=='bio' && <Img src='/trash.svg' alt="trash" onClick={handleDelete} />}
        </StyledEditTrash>
    );
}

export default EditTrash;
