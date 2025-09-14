<<<<<<< HEAD
# Evently - Hackathon & Event Management Platform

A modern, full-stack web application for organizing hackathons and tech events with AI-powered team matching.

## 🚀 Features

- **Event Management**: Create and organize hackathons with detailed information
- **Smart Registration**: Participant registration with skill tracking
- **AI Team Matching**: Intelligent team formation based on skill compatibility
- **Analytics Dashboard**: Real-time insights and event performance metrics
- **Responsive Design**: Clean, modern UI built with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Recharts** for data visualization
- **React Router** for navigation

### Backend
- **FastAPI** (Python)
- **SQLite** database
- **scikit-learn** for AI team matching
- **CORS** middleware for frontend communication

## 📦 Installation & Setup

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <your-git-url>
   cd evently
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:8080`

### Backend Setup

1. **Create backend directory**
   ```bash
   mkdir backend
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install fastapi uvicorn sqlite3 scikit-learn pandas numpy python-multipart
   ```

4. **Create the FastAPI backend** (`backend/main.py`):

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import json
from datetime import datetime
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = FastAPI(title="Evently API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
def init_db():
    conn = sqlite3.connect('evently.db')
    cursor = conn.cursor()
    
    # Events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT NOT NULL,
            required_skills TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            skills TEXT NOT NULL,
            experience TEXT,
            github TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Pydantic models
class EventCreate(BaseModel):
    name: str
    date: str
    location: str
    description: str
    required_skills: str

class UserCreate(BaseModel):
    name: str
    email: str
    skills: str
    experience: Optional[str] = None
    github: Optional[str] = None

class Event(BaseModel):
    id: int
    name: str
    date: str
    location: str
    description: str
    required_skills: str
    created_at: str

class User(BaseModel):
    id: int
    name: str
    email: str
    skills: str
    experience: Optional[str]
    github: Optional[str]
    created_at: str

# Initialize database on startup
init_db()

@app.get("/")
async def root():
    return {"message": "Evently API is running!"}

@app.post("/create_event")
async def create_event(event: EventCreate):
    try:
        conn = sqlite3.connect('evently.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO events (name, date, location, description, required_skills)
            VALUES (?, ?, ?, ?, ?)
        ''', (event.name, event.date, event.location, event.description, event.required_skills))
        
        conn.commit()
        event_id = cursor.lastrowid
        conn.close()
        
        return {"message": "Event created successfully", "event_id": event_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register")
async def register_user(user: UserCreate):
    try:
        conn = sqlite3.connect('evently.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO users (name, email, skills, experience, github)
            VALUES (?, ?, ?, ?, ?)
        ''', (user.name, user.email, user.skills, user.experience, user.github))
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        return {"message": "User registered successfully", "user_id": user_id}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/events", response_model=List[Event])
async def get_events():
    try:
        conn = sqlite3.connect('evently.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM events ORDER BY created_at DESC')
        events = cursor.fetchall()
        conn.close()
        
        return [
            Event(
                id=event[0],
                name=event[1],
                date=event[2],
                location=event[3],
                description=event[4],
                required_skills=event[5],
                created_at=event[6]
            ) for event in events
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users", response_model=List[User])
async def get_users():
    try:
        conn = sqlite3.connect('evently.db')
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM users ORDER BY created_at DESC')
        users = cursor.fetchall()
        conn.close()
        
        return [
            User(
                id=user[0],
                name=user[1],
                email=user[2],
                skills=user[3],
                experience=user[4],
                github=user[5],
                created_at=user[6]
            ) for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match_users")
async def match_users(event_id: int):
    try:
        conn = sqlite3.connect('evently.db')
        cursor = conn.cursor()
        
        # Get event details
        cursor.execute('SELECT * FROM events WHERE id = ?', (event_id,))
        event = cursor.fetchone()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Get all users
        cursor.execute('SELECT * FROM users')
        users = cursor.fetchall()
        conn.close()
        
        if len(users) < 2:
            return {"message": "Need at least 2 users for matching"}
        
        # Prepare skill data for similarity calculation
        user_skills = [user[3] for user in users]  # skills column
        
        # Use TF-IDF vectorization and cosine similarity
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(user_skills)
        similarity_matrix = cosine_similarity(tfidf_matrix)
        
        # Generate team suggestions (simplified)
        teams = []
        used_users = set()
        
        for i, user in enumerate(users):
            if i in used_users:
                continue
                
            # Find most similar users
            similarities = similarity_matrix[i]
            similar_indices = np.argsort(similarities)[::-1][1:4]  # Top 3 similar users
            
            team_members = [user]
            used_users.add(i)
            
            for idx in similar_indices:
                if idx not in used_users and len(team_members) < 4:
                    team_members.append(users[idx])
                    used_users.add(idx)
            
            if len(team_members) >= 2:
                teams.append({
                    "team_id": len(teams) + 1,
                    "members": [
                        {
                            "name": member[1],
                            "email": member[2],
                            "skills": member[3].split(",")
                        } for member in team_members
                    ],
                    "compatibility_score": float(np.mean([similarities[idx] for idx in similar_indices[:len(team_members)-1]]))
                })
        
        return {"teams": teams, "total_teams": len(teams)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/seed_demo")
async def seed_demo_data():
    try:
        conn = sqlite3.connect('evently.db')
        cursor = conn.cursor()
        
        # Clear existing data
        cursor.execute('DELETE FROM events')
        cursor.execute('DELETE FROM users')
        
        # Seed events
        demo_events = [
            ("AI Hackathon 2024", "2024-01-15T09:00:00", "San Francisco, CA", "Build the next generation of AI applications", "Python,Machine Learning,TensorFlow,React"),
            ("Web3 Developer Workshop", "2024-01-08T10:00:00", "Austin, TX", "Learn blockchain development", "Solidity,JavaScript,Web3.js,Smart Contracts"),
            ("Mobile App Challenge", "2023-12-20T09:00:00", "Seattle, WA", "Create innovative mobile applications", "React Native,Flutter,iOS,Android"),
            ("Sustainability Tech Jam", "2024-02-01T09:00:00", "Portland, OR", "Develop technology solutions for sustainability", "IoT,Data Science,Clean Tech,Python"),
            ("Fintech Innovation Summit", "2024-01-25T09:00:00", "New York, NY", "Build the future of financial technology", "Node.js,React,APIs,Security")
        ]
        
        for event in demo_events:
            cursor.execute('''
                INSERT INTO events (name, date, location, description, required_skills)
                VALUES (?, ?, ?, ?, ?)
            ''', event)
        
        # Seed users
        demo_users = [
            ("Alice Johnson", "alice@example.com", "React,JavaScript,UI/UX Design", "3 years frontend development", "https://github.com/alice"),
            ("Bob Smith", "bob@example.com", "Python,Machine Learning,Data Science", "5 years ML engineer", "https://github.com/bob"),
            ("Carol Davis", "carol@example.com", "Node.js,APIs,Backend Development", "4 years backend development", "https://github.com/carol"),
            ("David Wilson", "david@example.com", "React Native,Mobile Development,iOS", "2 years mobile developer", "https://github.com/david"),
            ("Eva Brown", "eva@example.com", "Solidity,Web3,Blockchain", "3 years blockchain developer", "https://github.com/eva"),
            ("Frank Miller", "frank@example.com", "Python,Django,PostgreSQL", "6 years full-stack developer", "https://github.com/frank"),
            ("Grace Lee", "grace@example.com", "UI/UX Design,Figma,User Research", "4 years UX designer", "https://github.com/grace"),
            ("Henry Taylor", "henry@example.com", "DevOps,AWS,Docker,Kubernetes", "5 years DevOps engineer", "https://github.com/henry"),
            ("Ivy Chen", "ivy@example.com", "Data Science,Analytics,Visualization", "3 years data scientist", "https://github.com/ivy"),
            ("Jack Robinson", "jack@example.com", "Security,Penetration Testing,Cybersecurity", "4 years security specialist", "https://github.com/jack")
        ]
        
        for user in demo_users:
            cursor.execute('''
                INSERT INTO users (name, email, skills, experience, github)
                VALUES (?, ?, ?, ?, ?)
            ''', user)
        
        conn.commit()
        conn.close()
        
        return {"message": "Demo data seeded successfully", "events": len(demo_events), "users": len(demo_users)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

5. **Run the backend**
   ```bash
   cd backend
   python main.py
   ```

The backend will be running at `http://localhost:8000`

6. **Seed demo data**
   ```bash
   curl -X POST http://localhost:8000/seed_demo
   ```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your GitHub repository to Vercel
   - Deploy automatically

2. **Environment Variables**
   - Set `VITE_API_URL=https://your-backend-url.com` in Vercel dashboard

### Backend Deployment (Railway/Render)

1. **Railway Deployment**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Render Deployment**
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Set build command: `cd backend && pip install -r requirements.txt`
   - Set start command: `cd backend && python main.py`

## 📋 API Endpoints

- `GET /` - Health check
- `POST /create_event` - Create new event
- `POST /register` - Register participant
- `GET /events` - Get all events
- `GET /users` - Get all users
- `POST /match_users` - AI team matching
- `POST /seed_demo` - Seed demo data

## 🧪 Demo Data

The application includes seed data:
- **5 sample events** across different tech domains
- **10 sample users** with diverse skill sets
- **AI team matching** based on skill compatibility

## 📸 Screenshots

*Note: Add screenshots of your deployed application here*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Add your deployed URL]
- **API Documentation**: `http://your-backend-url.com/docs`
=======
# Evently
Evently — smarter events with AI matchmaking, real-time analytics, and a slick, mobile-first experience.
>>>>>>> 0b52d285d5fcc50b6d1219037d249d554bfd71e0
