// 2 column resume

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRoleContext } from "../../context/RoleContext";
import { language, framework } from './skillsArray';
import { useAuthContext } from '../../context/AuthContext';

const Container = styled.div`
  font-family: Arial, sans-serif, Helvetica;
  margin: 0 auto;
  text-align: left;
  width: 100vw;
  padding: 3rem 5rem;
  font-size: 1.4rem;
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  column-gap: 15px;
  background-color: #fff;
`;

const NameSection = styled.section`
  text-align: center;
  margin-bottom: 5px;
  grid-column: 1/-1;
  border-bottom: 1px solid #000;
  padding-bottom: 10px;
`;

const Name = styled.h1`
  margin: 0;
  font-size: 2.8rem;
`;

const ContactInfo = styled.div`
  padding-top: 5px;
  font-size: 1.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  &>span{
    display: flex;
    align-items: center;
    gap: 8px
  }
`;

const Section = styled.section`
  margin-bottom: 6px;
`;

const SectionTitle = styled.p`
  margin: 0;
  font-size: 2.8rem;
`;

const Subsection = styled.div`
  margin-bottom: 5px;
`;

const SubTitle = styled.h3`
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const Description = styled.div`
  margin: 0;
  font-size: 1.6rem;
  display: flex;
  flex-direction:  column;
`;

const List = styled.ul`
  padding-left: 20px;
  margin: 0;
  font-size: 1.8rem;
  list-style: inherit;
`;

const ListItem = styled.li`
  font-size: 1.6rem;
`;

const Location = styled.p`
  font-size: 1.4rem;
  margin: 0;
`;

const Input= styled.input`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #de587c;
  color: #fafafa; 
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  cursor: pointer;
  grid-column: 1/-1;
`;

function Template2() {
    const { roleUser } = useRoleContext();
    const {authUser} = useAuthContext();
    const email=authUser.user.email; const name=authUser.user.username;
    const fileName= (authUser) ? authUser.user.username.split(' ').join('_')+"_Resume" : "No_User";
    const { educations, pastCompanies: experience, projects, skills, achievements, profileLinks } = roleUser;

    useEffect(() => {
        document.title = fileName; // Set your desired title here
    }, []); // Empty dependency array ensures this effect runs only once

    let languageResume = ""; let frameworkResume = ""; let others = "";
    for (let i = 0; i < skills.length; i++) {
        if (language.includes(skills[i].name.toLowerCase())) { languageResume += "• " + skills[i].name + ", "; }
        else if (framework.includes(skills[i].name.toLowerCase())) { frameworkResume += "• " + skills[i].name + ", "; }
        else { others += "• " + skills[i].name + ", "; }
    }
    if(languageResume!==""){ languageResume=languageResume.slice(0, -2); }
    if(frameworkResume!==""){ frameworkResume=frameworkResume.slice(0, -2); }
    if(others!==""){ others=others.slice(0, -2); }
    const onlyOne = [languageResume, frameworkResume, others].filter(n => n === "").length === 2; // true only if any 2 of them is empty

    const linkedinLink = profileLinks.filter((profileLink) => profileLink.name.toLowerCase() === "linkedin")[0]?.link;
    const githubLink = profileLinks.filter((profileLink) => profileLink.name.toLowerCase() === "github")[0]?.link;
    const otherLink = profileLinks.filter((profileLink) => (["github", "linkedin"].includes(profileLink.name.toLowerCase()) === false))[0]?.link;

    function printpage() {
        var printButton = document.getElementById("printpagebutton");
        printButton.style.visibility = 'hidden';
        window.print();
        printButton.style.visibility = 'visible';
    }

    return (
        <Container>
            <Input id="printpagebutton" type="button" value="Download" onClick={printpage}></Input>
            <NameSection>
                <Name>{name}</Name>
                <ContactInfo>
                    <span><img style={{ width: "18px" }} src='/envelope.svg' alt='email'></img> <a style={{ color: "#000" }} target='_blank' href={`mailto:${email}`}>{email}</a></span>
                    {linkedinLink && <span><img style={{ width: "18px" }} src='/linkedin.svg' alt='linkedin'></img> <a style={{ color: "#000" }} target='_blank' href={linkedinLink}>//linkedin</a></span>}
                    {githubLink && <span><img style={{ width: "18px" }} src='/github.svg' alt='github'></img> <a style={{ color: "#000" }} target='_blank' href={githubLink}>//github</a></span>}
                    {otherLink && <span><img style={{ width: "18px" }} src='/coding.svg' alt='coding'></img> <a style={{ color: "#000" }} target='_blank' href={otherLink}>//profile-link</a></span>}
                </ContactInfo>
            </NameSection>

            <div>
                {educations.length!==0 &&
                    <Section>
                        <SectionTitle>Education</SectionTitle>
                        {educations.map((education, index) => (
                            <Subsection key={index}>
                                <SubTitle>{education.name}</SubTitle>
                                <Description>{education.degree} in {education.major}</Description>
                                <Location>Cum. GPA: {education.cgpa} | {education.from}-{education.to}</Location>
                            </Subsection>
                        ))}
                    </Section>
                }

                {profileLinks.length!==0 && 
                    <Section>
                        <SectionTitle>Profile Links</SectionTitle>
                        <List style={{ listStyle: "none", padding: "0" }}>
                            {profileLinks.map((profileLink, index) => (
                                <ListItem key={index}><b>{profileLink.name}: </b><a style={{ color: "#000" }} href={profileLink.link} target='_blank'>//link</a></ListItem>
                            ))}
                        </List>
                    </Section>
                }

                {skills.length!==0 && 
                    <Section>
                        <SectionTitle>Skills</SectionTitle>
                        <Subsection>
                            {onlyOne ? (
                                languageResume+" "+frameworkResume+" "+others
                            ): (
                                <>
                                {languageResume && <Description><span style={{ fontWeight: "bold" }}>Languages: </span> <span>{languageResume}</span></Description>}
                                {frameworkResume && <Description><span style={{ fontWeight: "bold" }}>Frameworks & Library: </span> <span>{frameworkResume}</span></Description>}
                                {others && <Description><span style={{ fontWeight: "bold" }}>Familiar: </span> <span>{others}</span></Description>}
                                </>
                            )}
                        </Subsection>
                    </Section>
                }

            </div>

            <div>
                {experience.length!==0 && 
                    <Section>
                        <SectionTitle>Experience</SectionTitle>
                        {experience.map((company, index) => (
                            <Subsection key={index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <SubTitle>{company.name} &nbsp;| </SubTitle>
                                    <Description>{company.role}</Description>
                                </div>
                                <Location>{company.from} - {(company.to === 2099) ? "Present" : company.to}</Location>
                                <List>
                                    {company.description.split('.').map((desc, idx)=> (
                                        desc && <ListItem key={idx}>{desc}.</ListItem>
                                    ))}
                                </List>
                            </Subsection>
                        ))}
                    </Section>
                }

                {projects.length!==0 &&
                    <Section>
                        <SectionTitle>Projects</SectionTitle>
                        {projects.map((project, index) => (
                            <Subsection key={index}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <SubTitle>{project.name} &nbsp;| </SubTitle>
                                    <Description><a style={{ color: "#000" }} href={project.link} target="_blank">Deploy Link </a></Description>
                                </div>
                                <List>
                                    {project.description.split('.').map((desc, idx)=> (
                                        desc && <ListItem key={idx}>{desc}.</ListItem>
                                    ))}
                                </List>
                            </Subsection>
                        ))}
                    </Section>
                }

                {achievements.length!==0 &&
                    <Section>
                        <SectionTitle>Achievements</SectionTitle>
                        <List>
                            {achievements.map((achievement, index) => (
                                <ListItem key={index}>{achievement.description}.</ListItem>
                            ))}
                        </List>
                    </Section>
                }
            </div>
        </Container>
    );
}

export default Template2;
