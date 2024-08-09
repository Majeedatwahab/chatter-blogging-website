# Chatter: Elevate Your Voice – Where Every Word Matters

Welcome to **Chatter**, an innovative platform designed to empower users to create, share, and engage with content that matters. Chatter is a full-featured blogging platform where users can express themselves, connect with others, and explore a wide range of topics in a community-driven environment.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

**Chatter** is a Next.js-based blogging platform that emphasizes user interaction and community building. Users can create and share blog posts, engage with content through likes, comments, and bookmarks, and follow other users to stay updated with their latest posts.

## Features

### User Authentication
- **Sign Up / Sign In / Sign Out**: Secure authentication using Firebase.
- **Social Authentication**: Google sign-in for a faster login experience.

### Blog Creation and Management
- **Create Posts**: Rich text editor supporting Markdown for creating blog posts.
- **Edit & Delete Posts**: Manage your content with ease.
- **Image Upload**: Enhance your posts with image uploads.
- **Categories**: Organize content by assigning categories to each post.

### User Profiles
- **Profile Management**: Users can manage their profiles, including avatars and bios.


### Interactions
- **Likes**: Like posts to show appreciation.
- **Comments**: Engage in discussions by commenting on posts.
- **Bookmarks**: Bookmark posts for easy access later.
- **Share Posts**: Share posts via social media or copy the link to the clipboard.

### Search and Filtering
- **Search**: Search for posts by title.


### Responsive Design
- **Fully Responsive**: Optimized for mobile and desktop viewing.

### Security
- **Authentication**: Secure authentication with Firebase.
- **Authorization**: Role-based access control to secure admin functionalities.

## Tech Stack

- **Framework**: Next.js with Typescript(React)
- **Styling**: TailwindCSS
- **Authentication & Backend**: Firebase (Authentication, Realtime Database, Storage)
- **Icons**: React Icons
- **Markdown Rendering**: `react-syntax-highlighter` with `dracula` theme

## Installation

Follow these steps to set up and run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/chatter.git
   cd chatter
2. **Install the dependencies**:
   ```bash
   npm install

3. **Set up Firebase**:

- Create a Firebase project.
- Enable Firebase Authentication, Realtime Database, and Storage.
- Obtain the Firebase config object from your project settings.

## Environment Variables

1. **Set up environment variables**:
- Create a .env.local file in the root directory.
- Add the following environment variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
 ```
2. **Run the development server**:

   ```bash
   npm run dev

3. **Access the Application**:
- Open your browser and go to http://localhost:3000.


## Usage
1. Creating a Blog Post: After signing in, navigate to the 'Write' page. You can write your content using Markdown, upload images, and categorize your post before publishing.

2. Interacting with Posts: Browse through posts, and like, bookmark, comment, or share content that interests you.

3. Managing Your Profile: Update your bio, avatar, and view your activity in your dashboard section.


## Testing
 
 Chatter uses Jest for unit testing and Cypress for end-to-end testing(Jest stressed me out the most).

 **Running Tests**

 1. Unit Tests
    ```bash
    npm run test

2. End to End tests
   ```bash
   npm run cypress


## Deployment
Chatter is deployed using Vercel. To deploy your own version:

1. Push to GitHub: Ensure your code is committed and pushed to your GitHub repository.
2. Connect Vercel: Link your GitHub repository to Vercel.
3. Configure Environment Variables: Add the environment variables in Vercel's dashboard.
4. Deploy: Trigger a deployment from Vercel's dashboard or by pushing to the main branch.


## Contributing
I welcome contributions to Chatter! Here's how you can help:

1. Fork the repository on GitHub.

2. Clone your fork:
```bash 
  git clone https://github.com/your-username/chatter.git
```

3. Create a branch for your feature:
```bash
   git checkout -b feature-branch
   ```

4. Make your changes and commit them:

```bash 
    git commit -m "Description of your changes"
```

5. Push your changes to your fork: 
```bash
 git push origin feature-branch
 ```

 6.  Create a pull request on GitHub: 



## License
 MIT License

Copyright (c) [2024] [Majeedat Abdulwahab]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

