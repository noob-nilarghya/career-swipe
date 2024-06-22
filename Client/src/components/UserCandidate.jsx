import styled, { keyframes } from "styled-components";
import CompanyData from "./candidateProfile/CompanyData";
import ProjectData from "./candidateProfile/ProjectData";
import SkillData from "./candidateProfile/SkillData";
import EducationData from "./candidateProfile/EducationData";
import AchievementData from "./candidateProfile/AchievementData";
import ProfileData from "./candidateProfile/ProfileData";
import RoleInfoLoader from "../components/skeletons/RoleInfoLoader";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;

    border-radius: 1rem 0 0 0;
    background-color: #fff;

    background-image: url('/userInfo-bg.webp');
    background-size: cover;
    background-repeat: no-repeat;

    text-align: left;

    @media (max-width: 1200px) {
        margin-right: 1.5rem;
        border-radius: 1rem 1rem 0 0;
    }

    @media (max-width: 900px) {
        margin-top: ${({ purpose }) => (purpose === 'chatInfo') ? '0rem' : '0.2rem'};
    }

    @media (max-width: 750px) {
        border-right: 2px;
        border-left: 2px;
        border-image: linear-gradient(to bottom, #fff, #181818, #fff) 1 100%;
        border-style: solid;
        margin-right: 0rem;
    }

    @media (min-width: 750px) {
        overflow: scroll;

        &::-webkit-scrollbar { 
            display: none;
        }

        -ms-overflow-style: none;
        scrollbar-width: none; 
    }
`;
const UserAboutHeader = styled.div`
    height: fit-content;
    background-color: #e9ded8;
    padding: 2rem 3rem;
    border-bottom: 3px solid #efc7ba;
    border-top: 3px solid #efc7ba;
    
    &>span{
        font-weight: 500;
        font-size: 2.5rem;
        color: #002b36;
    }

    @media (max-width: 750px) {
        border-radius: 1rem 1rem 0 0;
    }
`;
const StyledAbout = styled.div`
    padding: 1.5rem 2.5rem;
    display: flex;
    flex-direction: column;
    color: #002b36;
`;
const Row = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem 0rem;
`;
const SectionHeading = styled.p`
    font-weight: 500;
    line-height: 16px;
    letter-spacing: .5px;
    width: fit-content;
    border-bottom: 2px solid #002b36;
`;
const Hr = styled.hr`
    border: none;
    border-top: 1.5px solid #ccc;
    width: 100%;
    margin: 0.2rem auto;
`;
const Profiles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    @media (max-width: 350px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 300px) {
        grid-template-columns: 1fr;
    }
`;
const A = styled.a`
    margin: 1.5rem auto;
    width: fit-content;
    margin-bottom: 0.5rem;
    padding: 0.8rem 1rem;
    border-radius: 1rem;
    background-color: #de587c;
    color: #fff;
    border:0px solid #002a42;
`;
const Span = styled.span`
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
    width: fit-content;
`;

const moveUFO = keyframes`
  0%,100% {
        transform: translate(0, 0);
    }
    25% {
        transform: translate(-5px, -5px);
    }
    50% {
        transform: translate(5px, 5px);
    }
    75% {
        transform: translate(-5px, 5px);
    }
`;

const ImgDiv= styled.div`
    animation: ${moveUFO} 3s infinite ease-in-out;
    transform-origin: center center;
`;


function UserCandidate({ roleInfo, remark, purpose }) {

    if (remark === 'No User') {
        return (
            <Wrapper>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                    <ImgDiv><img style={{width: "18rem"}} src="/no-info.svg" alt="no-info"></img></ImgDiv>
                    <span style={{marginTop: "1.5rem", fontSize: "2rem", fontWeight: "500", color: "#a85b46", padding: "1rem", borderRadius: "2rem", boxShadow: "rgb(225, 195, 179) 0px 0px 20px", border: "3px solid rgb(239, 199, 186)"}}>No more user info to show</span>
                </div>
            </Wrapper>
        );
    }
    if (!roleInfo) { return <Wrapper><RoleInfoLoader /></Wrapper>; }

    const name = roleInfo.userCandidate.username;
    const age = roleInfo.userCandidate.age;
    const relocate = roleInfo.relocate;
    const resume = roleInfo.resumeLink;
    const bio = roleInfo.bio;
    const companies = roleInfo.pastCompanies;
    const projects = roleInfo.projects;
    const skills = roleInfo.skills;
    const education = roleInfo.educations;
    const achievements = roleInfo.achievements;
    const profiles = roleInfo.profileLinks;

    return (
        <Wrapper purpose={purpose}>
            <UserAboutHeader>
                <span style={{ color: "#a85b46" }}>Candidate's Info</span>
            </UserAboutHeader>
            <StyledAbout>
                <Row>
                    {purpose !== 'chatInfo' &&
                        <div style={{ marginBottom: "1rem", color: "#de587c" }}>
                            <Span style={{ fontSize: "2rem", textTransform: "uppercase" }}>{name} ,</Span>
                            <Span style={{ fontSize: "2rem" }}> {age}</Span>
                        </div>
                    }
                    <div><span style={{ borderBottom: "2px solid #002b36" }}>Relocate:</span> <span>{(relocate) ? "Yes" : "No"}</span></div>
                    <p><span style={{ borderBottom: "2px solid #002b36" }}>Bio: </span> <span>&nbsp;{bio}</span></p>
                </Row>

                <Hr></Hr>

                <Row>
                    <SectionHeading>Past Companies :</SectionHeading>
                    <div>
                        {companies.map((company, index) => (
                            <div key={index}>
                                <CompanyData company={company} type='feedPage' index={index} />
                            </div>
                        ))}
                    </div>
                    {(companies.length === 0) && <span>No past companies to show here</span>}
                </Row>

                <Hr></Hr>

                <Row>
                    <SectionHeading>Projects: </SectionHeading>
                    <div>
                        {projects.map((project, index) => (
                            <div key={index}>
                                <ProjectData project={project} type='feedPage' index={index} />
                            </div>
                        ))}
                    </div>
                    {(projects.length === 0) && <span>No projects to show here</span>}
                </Row>

                <Hr></Hr>

                <Row>
                    <SectionHeading>Skills :</SectionHeading>
                    <div>
                        {skills.map((item, index) => <SkillData key={index} type='feedPage' skill={item} index={index} />)}
                    </div>
                    {(skills.length === 0) && <span>No skills to show here</span>}
                </Row>

                <Hr></Hr>

                <Row>
                    <SectionHeading>Education :</SectionHeading>
                    <div>
                        {education.map((edu, index) => (
                            <div key={index}>
                                <EducationData education={edu} type='feedPage' index={index} />
                            </div>
                        ))}
                    </div>
                    {(education.length === 0) && <span>No education to show here</span>}
                </Row>

                <Hr></Hr>

                <Row>
                    <SectionHeading>Achievements :</SectionHeading>
                    <div>
                        {achievements.map((achievement, index) => (
                            <div key={index}>
                                <AchievementData achievement={achievement} type='feedPage' index={index} />
                            </div>
                        ))}
                    </div>
                    {(achievements.length === 0) && <span>No achievements to show here</span>}
                </Row>

                <Hr></Hr>

                <Row>
                    <SectionHeading>Profiles: </SectionHeading>
                    <Profiles>
                        {profiles.map((profile, index) => (
                            <div key={index}>
                                <ProfileData profile={profile} type='feedPage' index={index} />
                            </div>
                        ))}
                    </Profiles>
                    {(profiles.length === 0) && <span>No profiles to show here</span>}
                </Row>

                <Hr></Hr>

                {resume && <A href={resume} target="_blank">Resume Link</A>}

            </StyledAbout>
        </Wrapper>
    );
}

export default UserCandidate;