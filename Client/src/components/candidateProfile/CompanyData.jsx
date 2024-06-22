import styled from "styled-components";
import CompanyForm from "./CompanyForm";
import EditTrash from "./EditTrash";
import { useState } from "react";

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


function CompanyData({company, type, index}) {
    const [editCompany, setEditCompany] = useState(false);
    const handleEdit= function(){
        setEditCompany((val)=>!val)
    }

    return (
        <>
            <Ul>
                <li key={index} style={{ marginLeft: "2rem" }}>
                    <div>
                        <HeadingSpan>{company.name}</HeadingSpan> <span>[{company.from}-{(company.to === 2099) ? `Present` : company.to}]</span> <br></br>
                        <span>Role &bull; {company.role} </span> <br></br>
                        <span>About &bull; {company.description}</span>
                    </div>
                </li>
            </Ul>
            {(type!=='feedPage') ? 
                <EditTrash type="company" id={company._id} handleEditClick={handleEdit} /> : <></>
            }
            
            {(editCompany && type!=='feedPage') &&
                <EditFormDiv>
                    <CompanyForm handleCompanyForm={handleEdit} company={company} purpose="edit" />
                </EditFormDiv>
            }
        </>
    );
}

export default CompanyData;
