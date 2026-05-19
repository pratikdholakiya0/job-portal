# 💼 Job Portal
 
A full-stack **Job Portal** web application that connects job seekers with employers. Built with a **Spring Boot** REST API backend and a **React** frontend, this platform supports job listings, applications, and user management in a clean, responsive interface.
 
---
 
## 🗂️ Project Structure
 
```
job-portal/
├── backend/        # Spring Boot (Java) REST API
└── frontend/       # React (JavaScript) web client
```
 
---
 
## 🛠️ Tech Stack
 
### Backend
- **Java** with **Spring Boot**
- REST API architecture
- Maven for dependency management
- **Spring Data MongoDB** (ODM)
- **MongoDB** (NoSQL database)
- Spring Security (authentication & authorization)
### Frontend
- **React.js** (JavaScript)
- React Router DOM (client-side routing)
- CSS / Bootstrap / Tailwind (UI styling)
---
 
## ✨ Features
 
- 🔐 **User Authentication** — Register and log in as a Job Seeker or Employer
- 👤 **Role-based Access** — Separate dashboards for job seekers and employers
- 📋 **Job Listings** — Employers can post, edit, and delete job openings
- 🔍 **Job Search** — Job seekers can browse and search available positions
- 📝 **Job Applications** — Apply for jobs and track application status
- 🏢 **Company Profiles** — Employer profile management
- 📱 **Responsive UI** — Works across desktop and mobile devices
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- **Java 17+** and **Maven 3.6+**
- **Node.js 18+** and **npm** (or Yarn)
- **MySQL** or **PostgreSQL** database
---
 
### 🔧 Backend Setup
 
1. **Clone the repository:**
   ```bash
   git clone https://github.com/pratikdholakiya0/job-portal.git
   cd job-portal/backend
   ```
 
2. **Configure the database:**
   Open `src/main/resources/application.properties` and update the following:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/job_portal
   # Or with authentication:
   # spring.data.mongodb.uri=mongodb://username:password@localhost:27017/job_portal
   spring.data.mongodb.database=job_portal
   ```
 
3. **Run the backend:**
   ```bash
   mvn spring-boot:run
   ```
 
   The API will start at `http://localhost:8080`.
---
 
### 🌐 Frontend Setup
 
1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```
 
2. **Install dependencies:**
   ```bash
   npm install
   ```
 
3. **Configure the API base URL** (if needed):
   In your `.env` file or the Axios config, set:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```
 
4. **Start the development server:**
   ```bash
   npm start
   ```
 
   The app will run at `http://localhost:3000`.
---
 

## 📡 API Overview
 
Base URL: `http://localhost:8080/api/v1`
 
> Swagger UI is available at `http://localhost:8080/swagger-ui/index.html`
 
### 🔓 Public Endpoints (No token required)
 
| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| POST   | `/auth/register`                  | Register a new user            |
| POST   | `/auth/login`                     | Login and receive JWT token    |
| GET    | `/company/getCompany/{id}`        | View a company profile by ID   |
| GET    | `/jobs/getById/{id}`              | View a job listing by ID       |
| GET    | `/jobs/getAll`                    | Browse all public job listings |
| ANY    | `/chat/**`                        | WebSocket chat endpoint        |
 
### 🔐 Authenticated Endpoints (JWT token required)
 
| Method | Endpoint                          | Description                           |
|--------|-----------------------------------|---------------------------------------|
| GET    | `/auth/me`                        | Get current logged-in user details    |
| POST   | `/auth/refresh-token`             | Refresh JWT access token              |
| ANY    | `/user/**`                        | User profile management               |
| GET    | `/jobs/getAllActive`              | Get active job listings               |
| ANY    | `/conversation/**`               | Access conversation/messages          |
 
### 🏢 Employer Role Endpoints (`ROLE_EMPLOYER`)
 
| Method | Endpoint                          | Description                           |
|--------|-----------------------------------|---------------------------------------|
| POST   | `/company/create`                 | Create a company profile              |
| PUT    | `/company/update`                 | Update company profile                |
| GET    | `/company/get`                    | Get own company profile               |
| POST   | `/jobs/create`                    | Post a new job listing                |
| PUT    | `/jobs/update/{id}`               | Update an existing job listing        |
| PUT    | `/applications/status/update`     | Update application status             |
| GET    | `/applications/by-employer`       | View all applications received        |
 
### 👤 Applicant Role Endpoints (`ROLE_APPLICANT`)
 
| Method | Endpoint                              | Description                        |
|--------|---------------------------------------|------------------------------------|
| ANY    | `/resume/**`                          | Manage resume / profile            |
| POST   | `/applications/submit`                | Submit a job application           |
| GET    | `/applications/my-applications`       | View all submitted applications    |
| GET    | `/applications/getById/{id}`          | View a specific application        |
| GET    | `/applications/history/{id}`          | View application history           |
 
---
 
## 🗃️ Database Setup
 
Make sure **MongoDB** is running locally (default port `27017`). You can start it with:
 
```bash
mongod
```
 
Spring Data MongoDB will automatically create the collections on first run — no manual schema setup required.
 
To use **MongoDB Atlas** (cloud), replace the URI in `application.properties` with your Atlas connection string:
 
```properties
spring.data.mongodb.uri=${MONGO_URI}
spring.data.mongodb.database=${MONGO_DB}
spring.data.mongodb.auto-index-creation=true

application.security.jwt.secret-key=${JWT_SECRET}
application.security.jwt.expiration=${JWT_EXPIRE}
```
 
---
 
## 🤝 Contributing
 
Contributions are welcome! To contribute:
 
1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request
---
 
## 📄 License
 
This project is open source and available under the [MIT License](LICENSE).
 
---
 
## 👤 Author
 
**Pratik Dholakiya**
- GitHub: [@pratikdholakiya0](https://github.com/pratikdholakiya0)
