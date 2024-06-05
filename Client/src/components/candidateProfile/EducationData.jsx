
import styled from "styled-components";
import EditTrash from "./EditTrash";
import { useState } from "react";
import EducationForm from "./EducationForm";

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

const EditFormDiv= styled.div`
    margin-bottom: 2rem;
    @media (max-width: 500px) {
        grid-column: 1/-1;
    }
`;

function EducationData({education, index, type}) {
    const [editEducation, setEditEducation] = useState(false);
    const handleEditEducation= function(){
        setEditEducation((val) => !val);
    }
    return (
        <>
            <Ul>
                <li key={index}>
                    <div>
                        <HeadingSpan>{education.name}</HeadingSpan> <span style={{ marginRight: "1rem" }}>{education.degree}</span> <span>[{education.from}-{education.to}]</span> <br></br>
                        <span style={{ marginRight: "1rem" }}>{education.major}</span> &bull; <span>CGPA: {education.cgpa}</span>
                    </div>
                </li>
            </Ul>
            {(type!=='feedPage') ? <EditTrash type="education" id={education._id} handleEditClick={handleEditEducation}/> : <></> }
            {(editEducation && type!=='feedPage') &&
                <EditFormDiv>
                    <EducationForm handleEducationForm={handleEditEducation} education={education} purpose="edit" />
                </EditFormDiv>
            }
        </>
    );
}

export default EducationData;
