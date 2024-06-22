// 1 column resume

import React from 'react'
import styled from 'styled-components';
import { useRoleContext } from "../../context/RoleContext";
import { language, framework } from './skillsArray';

const Container = styled.div`
  font-family: Arial, sans-serif, Helvetica;
  margin: 0 auto;
  text-align: left;
  max-width: 1250px;
  padding: 0;
  font-size: 1.45rem;
`;

const Header = styled.div`
  text-align: center;
`;

const Name = styled.h1`
  font-size: 2.8rem;
  margin: 0;
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
  margin-bottom: 5px;
`;

const SectionTitle = styled.h2`
  font-size: 2.1rem;
  border-bottom: 1.5px solid black;
  padding-bottom: 1px;
  margin: 5px 0px 5px 0px;
`;

const SubHeading = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.6rem;
`;

const Item = styled.div`
  margin: 5px 0;
`;

const ProjectList = styled.ul`
  list-style: initial;
  padding-left: 20px;
  margin: 0;
`;

const ProjectItem = styled.li`
  margin: 0;
`;

const SkillsList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 5px 0;
`;

const SkillItem = styled.li`
  margin: 1px 0;
`;

function Template1({email, name}) {
  const {roleUser} = useRoleContext();
  const {educations, pastCompanies: experience, projects, skills, achievements, profileLinks} = roleUser;

  let languageResume=""; let frameworkResume=""; let others="";
  for(let i=0; i<skills.length; i++){
    if(language.includes(skills[i].name.toLowerCase())){ languageResume+=skills[i].name+", "; } 
    else if(framework.includes(skills[i].name.toLowerCase())){ frameworkResume+=skills[i].name+", "; } 
    else{ others+=skills[i].name+", "; }
  }
  if(languageResume!==""){ languageResume=languageResume.slice(0, -2); }
  if(frameworkResume!==""){ frameworkResume=frameworkResume.slice(0, -2); }
  if(others!==""){ others=others.slice(0, -2); }
  const onlyOne = [languageResume, frameworkResume, others].filter(n => n === "").length === 2; // true only if any 2 of them is empty

  const linkedinLink= profileLinks.filter((profileLink) => profileLink.name.toLowerCase() === "linkedin")[0].link;
  const githubLink= profileLinks.filter((profileLink) => profileLink.name.toLowerCase() === "github")[0]?.link;
  const otherLink= profileLinks.filter((profileLink) => (["github", "linkedin"].includes(profileLink.name.toLowerCase()) === false))[0]?.link;

  return (
    <Container>
      <Header>
        <Name>{name}</Name>
        <ContactInfo>
          <span><img style={{ width: "18px" }} src='/envelope.svg' alt='email'></img> <a style={{ color: "#000" }} target='_blank' href={`mailto:${email}`}>{email}</a></span>
          {linkedinLink && <span><img style={{ width: "18px" }} src='/linkedin.svg' alt='linkedin'></img> <a style={{ color: "#000" }} target='_blank' href={linkedinLink}>//linkedin</a></span>}
          {githubLink && <span><img style={{ width: "18px" }} src='/github.svg' alt='github'></img> <a style={{ color: "#000" }} target='_blank' href={githubLink}>//github</a></span>}
          {otherLink && <span><img style={{ width: "18px" }} src='/coding.svg' alt='coding'></img> <a style={{ color: "#000" }} target='_blank' href={otherLink}>//profile-link</a></span>}
        </ContactInfo>
      </Header>

      <Section>
        <SectionTitle>Education</SectionTitle>
        {educations.map((education, index) => (
          <Item key={index}>
            <SubHeading style={{ fontWeight: "bold" }}>
              <span>{education.name}</span>
              <span>{education.from} -- {education.to}</span>
            </SubHeading>
            <div>{education.degree} | {education.major} | CGPA: {education.cgpa}</div>
          </Item>
        ))}
      </Section>

      <Section>
        <SectionTitle>Experience</SectionTitle>
        {experience.map((company, index) => (
          <Item key={index}>
            <SubHeading>
              <div style={{display: "flex"}}>
                <span style={{ fontWeight: "bold" }}>{company.name} | &nbsp;</span>
                <div>{company.role}</div>
              </div>
              <span style={{ fontWeight: "bold" }}>{company.from} -- {(company.to === 2099) ? "Present" : company.to}</span>
            </SubHeading>

            <ProjectList>
              {company.description.split('.').map((desc, idx)=> (
                  <ProjectItem key={idx}>{desc}.</ProjectItem>
              ))}
            </ProjectList>
          </Item>
        ))}
      </Section>

      <Section>
        <SectionTitle>Projects</SectionTitle>
        {projects.map((project, index) => (
          <Item key={index}>
            <SubHeading style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: "bold" }}>{project.name}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <a href={project.link} target='_blank'>LINK <img style={{ width: "18px" }} src='/link-resume.svg' alt='link'></img></a>
              </div>
            </SubHeading>

            <ProjectList>
              {project.description.split('.').map((desc, idx)=> (
                <ProjectItem key={idx}>{desc}.</ProjectItem>
              ))}
            </ProjectList>
          </Item>
        ))}
      </Section>

      <Section>
        <SectionTitle>Technical Skills</SectionTitle>
        {onlyOne ? (
            languageResume+" "+frameworkResume+" "+others
        ): (
          <SkillsList>
            {languageResume && <SkillItem><strong>Languages:</strong> {languageResume}</SkillItem>}
            {frameworkResume && <SkillItem><strong>Technologies/Frameworks:</strong> {frameworkResume}</SkillItem>}
            {others && <SkillItem><strong>Others:</strong> {others}</SkillItem>}
          </SkillsList>
        )}
      </Section>

      <Section>
        <SectionTitle>Achievements</SectionTitle>
        <ProjectList style={{ paddingLeft: "15px" }}>
          {achievements.map((achievement, index) => (
            <ProjectItem key={index}>{achievement.description}</ProjectItem>
          ))}
        </ProjectList>
      </Section>
    </Container>
  );
}

export default Template1;
