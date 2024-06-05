import styled from "styled-components";
import EditTrash from "./EditTrash";
import { useState } from "react";
import ProjectForm from "./ProjectForm";

const Ul = styled.ul`
    list-style: revert;
    &>li{
        margin-bottom: 1rem;
    }
`;
const HeadingSpan = styled.span`
    margin-right: 1rem;
    font-weight: 500;
    color: #000;
`;
const A = styled.a`
    &>img{
        width: ${(props) => (props.type==='feedPage') ? "1.3rem" : "1.3rem"};
    }
`;

const EditFormDiv= styled.div`
    margin-bottom: 2rem;
    @media (max-width: 500px) {
        grid-column: 1/-1;
    }
`;

function ProjectData({project, index, type}) {
    const [editProject, setEditProject] = useState(false);
    const handleEditProject= function(){
        setEditProject((val) => !val);
    }
    return (
        <>
            <Ul>
                <li key={index}>
                    <div>
                        <HeadingSpan>{project.name}</HeadingSpan> <A style={{ color: "blue" }} type={type} href={project.link} target="_blank"><img src='/link.svg' alt='link' /></A> <br></br>
                        <p>{project.description}</p>
                    </div>
                </li>
            </Ul>
            {(type!=='feedPage') ? 
                <EditTrash type="project" id={project._id} handleEditClick={handleEditProject}/> : <></>
            }
            {(editProject && type!=='feedPage') &&
                <EditFormDiv>
                    <ProjectForm handleProjectForm={handleEditProject} project={project} purpose="edit" />
                </EditFormDiv>
            }
        </>
    );
}

export default ProjectData;
