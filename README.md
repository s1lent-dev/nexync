# Nexync 🌐  
**"Where connections spark, and conversations flow. Scalable, seamless, and always in sync!"**

Nexync is a scalable and feature-rich chat application designed to serve millions of users concurrently with high performance and reliability. Built with a modern tech stack, it delivers seamless communication and real-time features that empower users to connect effectively.

---

<div style="background-color: black; padding: 10px; text-align: center;">
  <img src="public/main.png" alt="Image" style="background-color: black;">
</div>

## 🚀 Introduction

Nexync combines cutting-edge technologies to provide a robust and reliable communication platform.  
### Key Highlights:
- **Frontend:** Developed with **Next.js** for responsive, interactive user experiences.
- **Backend:** Powered by **Node.js** with a **microservices architecture** for modularity and scalability.
- **Real-Time Communication:** Utilizes **WebSockets** and **Redis Pub/Sub** for instant message delivery.
- **Messaging Queue:** Implements **Kafka** and **RabbitMQ** for efficient and high-throughput task handling.
- **Type Safety:** Fully written in **TypeScript** with **Zod** for runtime validation.

---

## 🛠️ Key Features

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/next.svg" alt="Next.js Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Frontend: <span style="color: #0070f3;">Next.js</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Delivers a highly responsive and dynamic interface with features like lazy loading and infinite scroll.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/node.svg" alt="Node.js Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Backend: <span style="color: #8CC84B;">Node.js</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Utilizes a microservices architecture to ensure modularity and high scalability.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/socket.svg" alt="WebSocket Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Real-Time Messaging: <span style="color: #8e44ad;">WebSockets & Redis</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Ensures low-latency communication with <strong>Socket.IO</strong> and scalable message delivery using <strong>Redis Pub/Sub</strong>.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/kafka.svg" alt="Kafka Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Message Queuing: <span style="color: #E18D00;">Kafka</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Processes messages in <strong>Kafka chat-topic</strong> (8 partitions) and efficiently stores them in <strong>PostgreSQL</strong> using bulk insertion every 5 seconds.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/redis.svg" alt="Redis Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Caching & Scalability: <span style="color: #DC382D;">Redis</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Implements API response caching to minimize latency and supports horizontal scaling for real-time features.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/rabbitmq.svg" alt="RabbitMQ Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Task Management: <span style="color: #FF6600;">RabbitMQ</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Handles secondary tasks like email notifications and OTP verification via task-specific queues.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/jwt.svg" alt="Authentication Icon" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Authentication</strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Cookie-based <strong>JWT authentication</strong> ensures secure session management.</li>
        <li><strong>Google</strong> and <strong>GitHub</strong> login via <strong>Passport.js</strong> provide seamless OAuth integration.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/firebase.svg" alt="Firebase Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Push Notifications: <span style="color: #FF5C8D;">Firebase FCM</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Real-time push notifications for instant user updates across devices.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/postgres.svg" alt="PostgreSQL Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Database: <span style="color: #336791;">PostgreSQL & Prisma</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Relational database with efficient data handling using <strong>Prisma ORM</strong>.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/typescript.svg" alt="TypeScript Logo" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Robust Typing: <span style="color: #3178C6;">TypeScript & Zod</span></strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Ensures type safety and secure data handling via strict runtime validations.</li>
    </ul>
</div>

<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
        <img src="public/fire.svg" alt="Performance Icon" style="width: 50px; height: 50px; margin-right: 10px;">  
        <strong>Performance Optimizations</strong>
    </div>
    <ul style="list-style-type: none; padding-left: 0;">
        <li>Features include debouncing, throttling, pagination, and suspense boundaries for enhanced performance.</li>
    </ul>
</div>


---

## 🏗️ Architecture

### 1️⃣ Chat System Architecture  
Efficiently handles millions of concurrent users with real-time communication powered by **WebSockets**, **Kafka**, and **Redis Pub/Sub**.  

<div style="background-color: black; padding: 10px; text-align: center;">
  <img src="public/chat-architecture.svg" alt="Image" style="background-color: black;">
</div>

#### Workflow:
1. **Message Flow:**
   - WebSocket servers receive messages from users.
   - Messages are simultaneously:
     - Published to **Kafka chat-topic** for processing and queuing in **Redis**.
     - Published to **Redis Pub/Sub** for instant delivery to recipients.
   - Bulk-inserted into **PostgreSQL** every 5 seconds for optimal performance.

2. **Load Balancing:**  
   - **Nginx reverse proxy** balances WebSocket connections across multiple servers.

---

### 2️⃣ Queuing System Architecture  
Handles secondary tasks such as email notifications and OTP verification using **RabbitMQ**.  

<div style="background-color: black; padding: 10px; text-align: center;">
  <img src="public/queue-architecture.svg" alt="Image" style="background-color: black;">
</div>

#### Workflow:
- Dedicated queues for specific tasks:
  - Reset Password Emails
  - Verification Code Emails
  - Welcome Notifications
- Messages are processed in a **FIFO** manner, ensuring task reliability and API performance.

---

## 📦 Setup & Installation

### Prerequisites
- **Node.js**
- **Docker**

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/s1lent-dev/nexync.git
   cd nexync

2. Start the application:
    ```bash
    docker-compose up
    Access the frontend at http://localhost:3000 and backend at http://localhost:5000.
    Note: For Google and GitHub authentication, generate credentials via Google Cloud Console and GitHub Developer Settings.

### 📖 Usage
### 1️⃣ Registration

<div style="background-color: black; padding: 10px; text-align: center;">
  <img src="public/register.png" alt="Image" style="background-color: black;">
</div>

#### A. Manual Registration:
- Create an account using your email and password.
- Verify your email using a unique verification code.
  - **Note**: If the verification code is not visible in your inbox, check your spam/junk folder. Emails will be sent from **deshpande.pxresh@gmail.com**.

#### B. OAuth Registration:
- Register via Google or GitHub.
- Credentials are autogenerated and emailed for convenience.
  - **Note**: If the email containing your autogenerated password is not visible, check your spam/junk folder. Emails will be sent from **deshpande.pxresh@gmail.com**.

<div style="background-color: black; padding: 10px; text-align: center;">
  <img src="public/login.png" alt="Image" style="background-color: black;">
</div>

### 2️⃣ Login

#### A. Manual Login:
- Use your email and password.

#### B. OAuth Login:
- Authenticate via Google or GitHub.

### 3️⃣ Features
- **Private Chats**: Chat directly with your connections.
- **Group Chats**: Create or join groups; manage members if you're an admin.
- **Connections**: Follow users, accept/reject connection requests, and explore profiles.
- **Settings**: Update profile picture, username, and bio.

---

### 🤝 Contributions
Contributions are welcome! Feel free to fork the repository and submit pull requests for improvements.

---

### 📝 License
This project is licensed under the MIT License.

---

### 📧 Contact
For queries or feedback, reach out via email: **deshpande.pxresh@gmail.com**


