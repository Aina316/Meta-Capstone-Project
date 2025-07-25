# [Gamers Den](https://meta-capstone-project-eight.vercel.app/)

**Here is the Demo!** 🎮


## Project Information
- **Intern:** Emmanuel Aina  
- **Intern Manager:** Jinny Choi  
- **Intern Director:** Matt Haggerty  
- **Peers:** Arman Alizadeh, Hailey Lin  


## Overview
- **Category:** Social Networking, E-commerce, Gaming etc. 
- **Story:** Gamers Den is a peer-to-peer game lending platform where users can manage their personal game collections, borrow games from others, and receive personalized recommendations based on their engagement and preferences.  
- **Market:** The app targets gamers of all ages, particularly those who are interested in sharing and accessing a wide variety of games without purchasing them outright.
- **Habit:** To borrow games you can't purchase and to lend games you aren't using currently.  
- **Scope:** The platform includes core game lending functionality, user profile management, in-app notifications, and an adaptive recommendation engine that evolves with user engagement and feedback.  


## Product Specifications

### **User Stories**

#### **Required Features**
- **User Authentication:**  
  - Users can sign up using email and password.  
  - Users can log in with verified credentials.  

- **Profile Management:**  
  - Users can view their profile with username, location, and borrower/lender scores.  
  - Users can view their personal game library (owned and borrowed games).  
  - Profiles are visible to other users.  

- **Game Management:**  
  - Add games with title, platform, condition, availability, and cover image (autofill via **IGDB API**).  
  - Remove games from collections.  

- **Game Browse & Search:**  
  - Browse all games available for borrowing in a dynamic grid.  
  - Search for games by title, platform, or genre.  
  - Clear search results with a button.  
  - Filter games by availability, platform, and genre.  

- **Game Details:**  
  - View detailed information for any game in a modal (title, platform, genre, availability, no of copies etc.).  

- **Lending System:**  
  - Send borrow requests for available games.  
  - Game owners can approve or decline requests.  
  - Approved games update status to “Borrowed.”  
  - All transactions are logged with current status.  

- **In-App Notifications:**  
  - Get notifications for borrow requests, approvals, declines, deadlines, and borrower feedback requests.  

- **Recommendations:**  
  - Personalized game recommendations powered by a **vector-based adaptive scoring algorithm**.  
  - Recommendations improve based on user engagement (clicks, borrows) and feedback (likes/dislikes).  

- **Responsive UI:**  
  - Fully responsive layout with navigation for Home, Profile, Requests, and Game Library.  



## Technical Challenge #1 – Adaptive Game Recommendation Engine
- Built a **vector-based recommendation system** using cosine similarity between user preferences (genre, platform) and game vectors.  
- Implemented **adaptive scoring** with dynamic weights based on engagement data (clicks, borrows) and feedback (upvotes/downvotes).  
- Integrated **time-decay logic** so recent activity is weighted more heavily than older actions.  
- Built **engagement tracking** to log user interactions (clicks, borrows) and rebuild user vectors dynamically.  



## Technical Challenge #2 – Automated Borrowing & Deadline Notifications
- Automated notifications for borrow requests, declines, and approvals.  
- Implemented **deadline reminders** for borrowers 48 hours before a game’s return date using GitHub Actions + Supabase scheduled scripts.  
- Added **rate-borrower modal** post-transaction for improving community trust via borrower scores.  


## Data Model / Server Endpoints
- **Supabase** used for authentication, database management, and row-level security.  
- Tables:  
  - `profiles` (user profiles, scores)  
  - `games` (user-owned copies)  
  - `catalog` (master game catalog)  
  - `requests` (borrow/loan transactions)  
  - `notifications` (in-app notifications)  
  - `recommendation_engagements` (clicks, borrows for recommendation tracking)  
  - `recommendation_feedback` (likes/dislikes for recommendations)  
  - `user_vectors` & `game_vectors` (precomputed vectors for recommendation engine).  
