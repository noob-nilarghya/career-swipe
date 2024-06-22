
import styled from "styled-components";
import EditTrash from "./EditTrash";
import { useState } from "react";
import ProfileForm from "./ProfileForm";

const Ul = styled.ul`
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
        width: ${(props)=> (props.type==='feedPage') ? "1.3rem" : "1.3rem"};
    }
`;

const EditFormDiv= styled.div`
    margin-bottom: 2rem;
    @media (max-width: 500px) {
        grid-column: 1/-1;
    }
`;

function ProfileData({profile, index, type}) {
    const [editProfile, setEditProfile] = useState(false);
    const handleEditProfile= function() {
        setEditProfile((val) => !val);
    }

    return (
        <>
            <Ul>
                <li key={index} style={{ marginLeft: "1rem" }}>
                    <div>
                        <HeadingSpan>{profile.name}</HeadingSpan> <A style={{ color: "blue" }} type={type} href={profile.link} target="_blank"><img src='/link.svg' alt='link' /></A>
                    </div>
                </li>
            </Ul>
            {(type!=='feedPage') ? <EditTrash type="profilelink" id={profile._id} section="profile" handleEditClick={handleEditProfile}/> : <></> }
            {(editProfile && type!=='feedPage') &&
                <EditFormDiv>
                    <ProfileForm handleProfileForm={handleEditProfile} profile={profile} purpose="edit" />
                </EditFormDiv>
            }
        </>
    );
}

export default ProfileData;

