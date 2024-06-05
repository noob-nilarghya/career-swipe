import formatDate from "../utils/dateFormatter";
import styled from "styled-components";
import RoleInfoLoader from "../components/skeletons/RoleInfoLoader";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;

    border-radius: 1rem 0 0 0;
    background-color: #fff;

    background-image: url('/userInfo-bg.webp');
    background-size: cover;
    background-repeat: no-repeat;

    @media (max-width: 1200px) {
        margin-right: 1.5rem;
        border-radius: 1rem 1rem 0 0;
    }

    @media (max-width: 900px) {
        margin-top: ${({purpose}) => (purpose === 'chatInfo') ? '0rem' : '0.2rem'};
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
    display: flex;
    gap: 1rem;
    align-items: center;
    
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
const Hr = styled.hr`
    border: none;
    border-top: 1.5px solid #ccc;
    width: 100%;
    margin: 0.2rem auto;
`;
const A = styled.a`
    margin: 1.5rem auto;
    width: fit-content;
    margin-bottom: 0.5rem;
    padding: 0.8rem 1rem;
    border-radius: 1rem;
    background-color: #008BDC;
    color: #fff;
    border: 1px solid #002a42;
`;
const Span = styled.span`
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.5px;
    width: fit-content;
`;


function UserRecruiter({ roleInfo, purpose }) {

    if(!roleInfo) { return <Wrapper><RoleInfoLoader /></Wrapper>; }

    const name = roleInfo.userRecruiter.username;
    const age = roleInfo.userRecruiter.age;
    const bio = roleInfo.bio;
    const company = (roleInfo.jobDescription) ? roleInfo.jobDescription.company : "-----";
    const jobRole = (roleInfo.jobDescription) ? roleInfo.jobDescription.jobRole : "-----";
    const location = (roleInfo.jobDescription) ? roleInfo.jobDescription.location : "-----";
    const salary = (roleInfo.jobDescription) ? roleInfo.jobDescription.salary : "-----";
    const salaryType = (roleInfo.jobDescription) ? roleInfo.jobDescription.salaryType : "-----";
    // const activeTill= formatDate(roleInfo.jobDescription.activeTill)
    const jobTerms = (roleInfo.jobDescription) ? roleInfo.jobDescription.terms : "-----";
    // const duration= roleInfo.jobDescription.duration;
    // const durationType= roleInfo.jobDescription.durationType;

    const aboutCompany = (roleInfo.jobDescription) ? roleInfo.jobDescription.aboutCompany : "-----";
    const aboutRole = (roleInfo.jobDescription) ? roleInfo.jobDescription.aboutRole : "-----";
    const responsibilities = (roleInfo.jobDescription) ? roleInfo.jobDescription.responsibilities : "-----";
    // const requirements = roleInfo.jobDescription.requirements;
    // const applyLink= roleInfo.jobDescription.applyLink;



    return (
        <Wrapper purpose={purpose}>
            <UserAboutHeader>
                <span style={{color: "#a85b46"}}>Recruiter's Info</span>
            </UserAboutHeader>
            <StyledAbout>
                <Row>
                    {purpose !== 'chatInfo' && 
                        <div style={{ marginBottom: "1rem", color: "#de587c" }}>
                            <Span style={{ fontSize: "2rem", textTransform: "uppercase" }}>{name} ,</Span>
                            <Span style={{ fontSize: "2rem" }}> {age}</Span>
                        </div>
                    }
                    <p><Span style={{ borderBottom: "2px solid #002b36" }}>Bio:</Span> <span>&nbsp;{bio}</span></p>
                </Row>

                <Hr></Hr>

                <Row>
                    <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Span style={{ fontSize: "1.8rem", textTransform: "uppercase" }}>Job Description: </Span>
                        {(roleInfo.jobDescription) && <div><Span>Apply Till: </Span> <span>{formatDate(roleInfo.jobDescription.activeTill)}</span></div>}
                    </div>
                    <div>
                        <p><Span>Company:</Span> <span>&nbsp;{company}</span></p>
                        <p><Span>Role:</Span> <span>&nbsp;{jobRole}</span></p>
                        <p><Span>Location:</Span> <span>&nbsp;{location}</span></p>
                        <Span>Terms:</Span> <span>&nbsp;{jobTerms}</span>
                        {(jobTerms !== 'Full time') && (<><Span style={{ marginLeft: "3rem" }}>Duration: </Span> <span>{(roleInfo.jobDescription) ? roleInfo.jobDescription.duration : "-----"} {(roleInfo.jobDescription) ? roleInfo.jobDescription.durationType : "-----"}(s)</span></>)}
                        <br></br>
                        <Span>Salary: </Span> <span>{salary} Rupees {salaryType}</span>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Span style={{ borderBottom: "2px solid #002b36" }}>About Us:</Span>
                        <p>{aboutCompany}</p>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Span style={{ borderBottom: "2px solid #002b36" }}>About Role:</Span>
                        <p>{aboutRole}</p>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Span style={{ borderBottom: "2px solid #002b36" }}>Responsibilities:</Span>
                        <ul style={{ listStyle: "revert", paddingLeft: "0.5rem" }}>
                            {responsibilities.split('\n').map((para, index) => (
                                <li key={index}>{para}</li>
                            ))}
                        </ul>
                    </div>
                    {roleInfo.jobDescription && roleInfo.jobDescription.requirements && (
                        <div style={{ marginTop: "1rem" }}>
                            <Span style={{ borderBottom: "2px solid #002b36" }}>Additional Requirements:</Span>
                            <ul style={{ listStyle: "revert", paddingLeft: "0.5rem" }}>
                                {roleInfo.jobDescription.requirements.split('\n').map((para, index) => (
                                    <li key={index}>{para}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Row>

                <Hr></Hr>

                {roleInfo.jobDescription && roleInfo.jobDescription.applyLink && <A href={roleInfo.jobDescription.applyLink} target="_blank">Apply Here</A>}

            </StyledAbout>
        </Wrapper>
    );
}

export default UserRecruiter;
