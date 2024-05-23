If I were given two weeks to enhance the project, here are the changes I would focus on across several dimensions, including code quality, user experience (UX), performance, and scalability:

### Code Quality

1. **Modularization and Refactoring**

   - **Break down large page** into smaller, reusable units to improve readability and maintainability. Mainly, the section for handling WebSocket communication and the section for handling API calls can be separated into different modules.

2. **Error Handling**

   - **Implement comprehensive error handling** across all API calls and WebSocket communications to gracefully handle and report errors. Right now, the error handling is minimal and can be improved.
   - **Use a central logging system** (e.g., Winston or Bunyan) for consistent logging across the backend, Im just using console.log for now.

3. **Unit and Integration Testing**

   - Write **unit tests** for utility functions such as `RRML2HTML` and `incompleteRRML2HTML`.
   - Implement **integration tests** for the WebSocket and HTTP server endpoints using frameworks like Jest and Supertest.

4. **TypeScript Integration**
   - Convert the project to TypeScript to gain the benefits of static typing, better documentation, and improved refactoring capabilities.

### User Experience (UX)

1. **Loading Indicators**
   - Add more **sophisticated loading indicators** to provide better feedback when waiting for responses, especially on the WebSocket connection.

### Performance

1. **Optimize WebSocket Communication**

   - **Batch messages** where possible to reduce communication overhead.
   - **Implement throttling** to handle high-frequency message updates better.

2. **Server Performance**
   - Use a **load balancer** (Nginx, HAProxy) to distribute WebSocket connections and API requests across multiple instances of the server, improving scalability.

### Documentation

1. **Documentation and Guides**

   - Write comprehensive documentation for setting up, deploying, and maintaining the project.
   - Include **API documentation** using tools like Swagger for easy integration and testing by other developers.

2. **Code Comments**
   - Improve inline code comments to explain complex logic and decision-making processes.

### General Notes

- I ended up using a simple approach to integrate WebSocket streaming into the system. However, with more time, I would explore more advanced techniques like Web Workers to offload processing from the main thread.
- After implementing the websocket streaming, I noticed that output was wrong since the rmmltohtml function was implemented to only handle complete rrml tags, I would implement a function to handle incomplete rrml tags by splitting the rrml tags and processing them as they come in.
- The fronetnd had an issue with the websocket connection in dev mode where it would duplicate the messages, Due to a lack of time I just fixed it by setting strictmode to false in the react app, I would investigate the issue further and fix it properly.
