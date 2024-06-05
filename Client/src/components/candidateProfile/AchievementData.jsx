import styled from "styled-components";
import EditTrash from "./EditTrash";
import AchievementForm from "./AchievementForm";
import { useState } from "react";

const Ul = styled.ul`
    list-style: revert;
    &>li{
        margin-bottom: 1rem;
    }
`;

const EditFormDiv= styled.div`
    margin-bottom: 2rem;
    @media (max-width: 500px) {
        grid-column: 1/-1;
    }
`;

function AchievementData({achievement, index, type}) {
    const [editAchievement, setEditAchievement] = useState(false);
    const handleEditAchievement= function () {
        setEditAchievement((val) => !val);
    }
    return (
        <>
            <Ul>
                <li key={index} style={{ marginBottom: "0.5rem" }}>{achievement.description}</li>
            </Ul>
            {(type!=='feedPage') ? <EditTrash section="achievement" type="achievement" id={achievement._id} handleEditClick={handleEditAchievement}/> : <></> }
            {(editAchievement && type!=='feedPage') &&
                <EditFormDiv>
                    <AchievementForm achievement={achievement} handleAchievementForm={handleEditAchievement} purpose="edit" />
                </EditFormDiv>
            }
        </>
    );
}

export default AchievementData;
