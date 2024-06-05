import styled from "styled-components";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const StyledAppLayout= styled.div`
    max-height: 100vh;
`;



function AppLayout() {

    return (
        <StyledAppLayout>
            <Header />
            <Outlet />
            <Footer />
        </StyledAppLayout>
    );
}

export default AppLayout;
