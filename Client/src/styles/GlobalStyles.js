import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root { 
    /* Applied to both light and dark mode */

    /* Indigo */
    --color-brand-50: #eef2ff;


    &, &.light-mode{ /* Default / Light mode */
      /* Grey */
      --color-grey-0: #fff;

      --image-grayscale: 0;
      --image-opacity: 100%;
    }

    &.dark-mode {
      --color-grey-0: #18212f;

      --image-grayscale: 10%;
      --image-opacity: 90%;
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;

    /* Creating animations for dark mode */
    transition: background-color 0.3s, border 0.3s;
  }

  html {
    scroll-behavior: smooth;
    font-size: 62.5%;

    @media (max-width: 800px){
      font-size: 61%;
    }

    @media (max-width: 600px){
      font-size: 58.5%;
    }

    @media (max-width: 500px){
      font-size: 56%;
    }

    @media (max-width: 450px){
      font-size: 53%;
    }

    @media (max-width: 400px){
      font-size: 52%;
    }
  }

  body {
    font-family: 'Rubik', sans-serif;
    font-weight: 300;
    font-style: normal;
    background-color: #f1fafa;
    color: #1a1a1a;

    transition: color 0.3s, background-color 0.3s;
    min-height: 100vh;
    min-height: 100dvh;
    line-height: 1.5;
    font-size: 1.6rem;

    overflow: hidden;
    overflow-y: scroll;

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
      width: 0px;
      background: transparent; /* Optional: hide scrollbar space */
    }
  }


  input, button, textarea, select {
    font: inherit;
    color: inherit;
  }

  select{
    border-radius: 0.5rem;
  }

  a, button {
    cursor: pointer;
  }

  *:disabled {
    cursor: not-allowed;
  }

  select:disabled, input:disabled {
    /* background-color: var(--color-grey-200);
    color: var(--color-grey-500); */
  }

  input:focus, button:focus, textarea:focus, select:focus {
    /* outline: 2px solid var(--color-brand-600); */
    outline-offset: -1px;
  }

  /* Parent selector, finally 😃 */
  button:has(svg) {
    line-height: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
    hyphens: auto;
  }

  img {
    max-width: 100%;

    /* For dark mode */
    /* filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity)); */
    filter: drop-shadow(10px 10px 20px rgba(50,50,50, 0.1));
  }

`;

export default GlobalStyles;
