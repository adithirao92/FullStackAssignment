# Full Stack Assignment

This project is a full-stack application that scrapes blog articles, stores them in a database, enhances them using LLMs, and displays them via a React frontend.

---

## Tech Stack
- Backend: Node.js, Express
- Database: MongoDB (Atlas)
- Scraping: Axios, Cheerio
- LLM Integration: Groq (LLaMA 3.1)
- Frontend: React
- Version Control: Git & GitHub

---

## Phase 1 – Backend & Scraper
- Scrapes latest blogs from BeyondChats
- Stores articles in MongoDB
- CRUD APIs for articles:
  - `GET /articles`
  - `POST /articles`
  - `PUT /articles/:id`
  - `DELETE /articles/:id`

---

## Phase 2 – Automated Article Enhancement
- Selects non-updated articles
- Searches Google for related articles (SerpAPI)
- Scrapes reference content
- Uses LLM to rewrite original article
- Appends references
- Updates article via API


---

## Phase 3 – Frontend (React)
- Displays all articles
- Shows updated / non-updated status
- Displays references for updated articles
- Fetches data from backend APIs

---

## How to Run

### Backend
```bash
cd backend
npm install
node server.js
node scripts/updateArticle.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```
