<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexync README</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #121212;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3 {
      color: #00e6e6;
      text-align: center;
    }
    a {
      color: #1db954;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .center {
      text-align: center;
    }
    .image-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0;
    }
    .image-container img {
      max-width: 80%;
      height: auto;
      border: 2px solid #00e6e6;
      border-radius: 10px;
    }
    .architecture {
      background-color: #000000;
      padding: 20px;
      border-radius: 15px;
    }
    .logos {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      margin: 20px 0;
    }
    .logos img {
      width: 50px;
      height: 50px;
    }
    .code-block {
      background-color: #1e1e1e;
      color: #d4d4d4;
      padding: 15px;
      border-radius: 10px;
      overflow-x: auto;
      margin: 20px 0;
    }
  </style>
</head>
<body>

<h1>Nexync</h1>
<p class="center"><strong>"Where connections spark, and conversations flow. Scalable, seamless, and always in sync!"</strong></p>

<div class="image-container">
  <img src="public/main.png" alt="Home Page">
</div>

<h2>Table of Contents</h2>
<ol>
  <li><a href="#introduction">Introduction</a></li>
  <li><a href="#key-features">Key Features</a></li>
  <li><a href="#architecture">Architecture</a>
    <ul>
      <li><a href="#chat-system-architecture">Chat System Architecture</a></li>
      <li><a href="#queuing-system-architecture">Queuing System Architecture</a></li>
    </ul>
  </li>
  <li><a href="#setup-and-installation">Setup and Installation</a></li>
  <li><a href="#usage">Usage</a>
    <ul>
      <li><a href="#registration-process">Registration Process</a></li>
      <li><a href="#login-process">Login Process</a></li>
      <li><a href="#chatting-and-connecting-process">Chatting and Connecting Process</a></li>
    </ul>
  </li>
  <li><a href="#license">License</a></li>
</ol>

<h2 id="introduction">Introduction</h2>
<p>Nexync is a modern chat platform with a focus on scalability and seamless communication. Developed using:</p>

<div class="logos">
  <img src="public/logos/nextjs.svg" alt="Next.js Logo">
  <img src="public/logos/nodejs.svg" alt="Node.js Logo">
  <img src="public/logos/socketio.svg" alt="Socket.IO Logo">
  <img src="public/logos/kafka.svg" alt="Kafka Logo">
  <img src="public/logos/redis.svg" alt="Redis Logo">
  <img src="public/logos/rabbitmq.svg" alt="RabbitMQ Logo">
</div>

<ul>
  <li><strong>Frontend:</strong> Built with Next.js for a responsive and interactive user experience.</li>
  <li><strong>Backend:</strong> Node.js with a microservices architecture to ensure scalability and modularity.</li>
  <li><strong>Technologies:</strong> WebSockets, Kafka, Redis, RabbitMQ, Prisma ORM, PostgreSQL, Firebase FCM, and Redux.</li>
  <li><strong>Type Safety:</strong> Fully written in TypeScript with runtime validation using Zod.</li>
</ul>

<h2 id="key-features">Key Features</h2>
<p>Highlights include:</p>
<ul>
  <li>Real-time communication powered by WebSockets and Socket.IO.</li>
  <li>High-throughput messaging using Kafka with an 8-partition chat-topic.</li>
  <li>Strategic caching and Pub/Sub messaging using Redis.</li>
  <li>Efficient task handling with RabbitMQ queues.</li>
  <li>Secure authentication with cookie-based JWT and OAuth via Passport.js.</li>
  <li>Type-safe database operations with Prisma and PostgreSQL.</li>
</ul>

<h2 id="architecture">Architecture</h2>

<h3 id="chat-system-architecture">Chat System Architecture</h3>
<div class="architecture">
  <div class="image-container">
    <img src="public/chat-architecture.svg" alt="Chat System Architecture">
  </div>
</div>
<p>Message flow in the system includes WebSocket connections, Kafka message processing, Redis Pub/Sub, and bulk insertion into PostgreSQL.</p>

<h3 id="queuing-system-architecture">Queuing System Architecture</h3>
<div class="architecture">
  <div class="image-container">
    <img src="public/queuing-architecture.svg" alt="Queuing System Architecture">
  </div>
</div>
<p>Handles secondary tasks like sending emails and notifications efficiently using RabbitMQ queues.</p>

<h2 id="setup-and-installation">Setup and Installation</h2>
<div class="code-block">
  <pre>
1. Clone the repository:
   git clone &lt;repository-url&gt;
   cd nexync

2. Start the services:
   docker compose up

3. Access the application:
   Frontend: http://localhost:3000
   Backend: http://localhost:5000
  </pre>
</div>

<p><strong>Note:</strong> Google and GitHub authentication require credentials from their respective developer consoles.</p>

<h2 id="usage">Usage</h2>
<p>Detailed workflows for:</p>
<ul>
  <li><strong>Registration:</strong> Manual or OAuth-based account creation.</li>
  <li><strong>Login:</strong> Manual or OAuth-based authentication.</li>
  <li><strong>Chatting and Connecting:</strong> Private and group chats, friend requests, and connection management.</li>
</ul>

<h2 id="license">License</h2>
<p>Nexync is released under the <a href="LICENSE">MIT License</a>.</p>

</body>
</html>
