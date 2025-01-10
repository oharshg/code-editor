# CompileX

CompileX is a web-based code editor and community platform where users can write, compile, and share code snippets in various programming languages. It provides a collaborative environment for developers to learn, share, and grow together.

## Features

- **Code Editor**: Write and compile code in multiple programming languages.
- **User Authentication**: Sign up and log in to access personalized features.
- **Community Submissions**: Share your code snippets and view others' submissions.
- **Theme Toggle**: Switch between light and dark themes.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript.
- **Tailwind CSS**: Utility-first CSS framework.
- **Vite**: Next-generation frontend tooling.
- **Radix UI**: Accessible, unstyled UI components.
- **Axios**: Promise-based HTTP client.
- **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.

### Backend

- **Node.js**: JavaScript runtime built on Chrome's V8 engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **JWT**: JSON Web Tokens for secure user authentication.
- **Zod**: TypeScript-first schema declaration and validation library.

## Deployment

### Frontend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

### Backend

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run start
   ```

## Environment Variables

Create a `.env` file in the backend directory and add the following environment variables:

```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=<your-port>
```

Create a `.env` file in the frontend directory and add the following environment variables:

```
VITE_BACKEND_URL=<your-backend-url>
```

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

Thank you for contributing to CompileX!
