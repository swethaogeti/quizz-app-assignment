import React from "react";
import styled from "styled-components";

const LayoutContainer = styled.div`
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  object-fit: cover;
`;

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <LayoutContainer>
        {children}
      </LayoutContainer>
    </>
  );
};

export default Layout;
