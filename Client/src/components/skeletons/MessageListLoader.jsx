import React from 'react';
import ContentLoader from 'react-content-loader';

const MessageListLoader = () => (
  <ContentLoader viewBox="0 0 300 475" height={475} width={300} backgroundColor="#d5eaeb" foregroundColor="#bbdfc9">
    <circle cx="50.2" cy="73.2" r="30.3" />
    <rect x="109.9" y="40.5" width="105.5" height="12" />
    <rect x="109.9" y="60.7" width="276" height="12" />
    <rect x="109.9" y="85.8" width="233.5" height="12" />

    <circle cx="50.7" cy="190.5" r="30.3" />
    <rect x="100.4" y="160.9" width="105.5" height="12" />
    <rect x="100.4" y="180" width="276" height="12" />
    <rect x="100.4" y="205.2" width="233.5" height="12" />

    <circle cx="50.7" cy="300.7" r="30.3" />
    <rect x="100.4" y="275" width="105.5" height="12" />
    <rect x="100.4" y="295.2" width="276" height="12" />
    <rect x="100.4" y="320.3" width="233.5" height="12" />
  </ContentLoader>
);

export default MessageListLoader;