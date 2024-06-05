
import React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';

const Wrapper= styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  transform: scale(1.5);
  margin-top: 10rem;
`;

const FeedLoading = () => {
  return (
    <Wrapper>
      <ContentLoader speed={1} width={200} height={400} viewBox="0 0 300 400" backgroundColor="#d5eaeb" foregroundColor="#bbdfc9" >
        <rect x="42" y="53" rx="0" ry="0" width="2" height="300" />
        <rect x="256" y="55" rx="0" ry="0" width="2" height="300" />
        <rect x="41" y="53" rx="0" ry="0" width="216" height="2" />
        <rect x="41" y="353" rx="0" ry="0" width="216" height="2" />
        <circle cx="147" cy="147" r="44" />
        <rect x="44" y="53" rx="0" ry="0" width="216" height="41" />
        <rect x="68" y="207" rx="0" ry="0" width="160" height="9" />
        <rect x="101" y="236" rx="0" ry="0" width="92" height="9" />
        <rect x="76" y="324" rx="0" ry="0" width="146" height="51" />
      </ContentLoader>
    </Wrapper>
  )
}

export default FeedLoading;
