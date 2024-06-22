
# Career-Swipe

Welcome to Career-Swipe!

This innovative application revolutionizes the job search and hiring process for both Candidates and Recruiters. No more stressful and outdated methods of job hunting and posting. With Career-Swipe, the experience is as easy and enjoyable as swiping right.

#### For Recruiters:
Recruiters can effortlessly post job openings and browse through candidate profiles. If a candidate catches your eye, simply swipe right.

#### For Candidates:
Candidates can explore job postings and swipe right on the ones they find interesting, just like on Tinder.

#### It's a Match!
When both a Candidate and a Recruiter swipe right on each other, it’s a match! You can then seamlessly start a conversation through our integrated chat feature and schedule an interview.

Join Career-Swipe today and experience a smarter, faster, and more enjoyable way to connect top talent with top companies!

## Features

Career-Swipe is packed with robust, modern features designed to enhance your experience:

- **Responsive Design:** Our application is fully responsive, ensuring a smooth experience on any screen size.
- **Easy Registration & Login:** Users can register, log in, and log out (protected routes) effortlessly. Rest assured, your password is securely encrypted.
- **Reset Password:** In case user forget password, he/she can reset it by clicking on reset link which will be sent to their registered email.
- **Job Management for Recruiters:** Recruiters can easily add, edit, and delete job descriptions with our intuitive CRUD (Create, Read, Update, Delete) operations.
- **Resume Management for Candidates:** Candidates can manage their resumes just as easily, with the ability to add, edit, and delete their information.
- **Resume Builder for Candidates:** Candidate can build their high quality resume (in A4 size PDF format) with one click. There are 2 ATS friendly popular template availabe (single column and double column). The PDF will be selectable or searchable as well.
- **User Profile Management:** Both Candidates and Recruiters can update their user information, including email, password, age, profile picture, and more.
- **Integrated Chat:** Once matched, Recruiters and Candidates can communicate seamlessly through our built-in chat feature to discuss further details.
- **Chat Organization:** The chat section is organized into two tabs:
  - **Matches:** Start a new conversation with your matches.
  - **Chats:** Continue existing conversations.
- **User Blocking:** For added control, users can block each other by tapping the three dots in the chat section.
- **Email Notifiation:** User will be notified with 'Welcome Signup email', 'Match status', 'Password Reset Link' etc on their registered email

Experience the future of job searching and recruiting with Career-Swipe!


## Installation
Clone and download this repository

Create a .env file, copy the content of .env.example and fill your envoironment variable
Do the exact same thing with Client/.env.example as well

**NOTE: CLIENT_URL and VITE_SERVER_URL should be on the same PORT**

Now open terminal in root directory and give the following command:
```bash
  cd Client/
  npm install
  cd ..
  npm install
  npm run build
  npm run server
```

Open the URL to access the website 🎉

    
## Tech Stack

**Frontend:** React, Redux, Zustand, react-query, Styled-Components, Vite, EJS

**Backend:** Node.js, Express.js, MongoDB, Socket.io, Multer, Sharp

**Optimization:** Feed Query Optimization is done using Pre-fetching (Batch Request), with LIMITS and OFFSET


## Screenshots

Homepage:

![Homepage](https://i.ibb.co/YhLcxP9/Homepage.png)

Profile:

![Menu](https://i.ibb.co/wMxzb0Z/profile.png)

Resume (of Candidate):

![Resume](https://i.postimg.cc/c1Rz8fCW/resume.png)

Resume Builder & Template (of Candidate)

![resume.png](https://i.postimg.cc/yYz8cWHX/resume.png)

Job Description (of Recruiter):

![Job Posting](https://i.ibb.co/xhNT4gn/jd.png)

Feed:

![Feed](https://i.ibb.co/x24tsbL/feed-user.png)

Feed (with no user):

![Feed (with no user)](https://i.ibb.co/CtM89NX/feed-no-user.png)

Chatting:

![Chatting](https://i.postimg.cc/0ymN1tZm/message.jpg)
## Authors

- [@noob-nilarghya](https://www.github.com/noob-nilarghya)

