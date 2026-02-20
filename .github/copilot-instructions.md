## TypeScript Express Backend – Architecture & Development Standards

---

## 1. Project Architecture

Project structure:

```
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── dtos/
│   └── types/
├   └── validations/

```

Copilot must strictly follow this architecture.

---

## 2. Core Technical Standards

- Use **TypeScript with strict mode enabled**
- Use **ES module syntax**
- Maintain strict separation of concerns:
  - Routes → Controllers → Models

- No database or ORM usage
- Use **in-memory storage only**
- Use **UUID v4** for all unique identifiers
- Do not modify files outside the requested scope
- If any requirement is unclear, request clarification

---

## 3. Folder Responsibilities

### routes/

- Define endpoints only
- No business logic
- Attach Joi validation middleware before controller
- Forward errors using `next()`
- Export router as default

---

### controllers/

- Contain business logic only
- No Joi schemas
- No raw `res.json()` usage
- Use centralized response structure
- Wrap all async logic in try/catch
- Forward errors using `next(error)`

---

### models/

- Define TypeScript interfaces
- Encapsulate in-memory storage
- Storage must use:
  - `Map` or `Array`

- Do not allow direct external mutation
- Controllers must interact through defined methods only

---

### dtos/

- Define request DTOs
- Define response DTOs
- Maintain strict typing
- No business logic

---

### types/

- Define shared interfaces
- Define custom types
- Define reusable generic types
- Keep pure type definitions only

---

### middleware/

- Validation middleware
- Global error handler
- No business logic

---

## 4. API Design Standards

- Follow REST standards

- Use plural resource naming

- HTTP Methods:
  - GET – Retrieve
  - POST – Create
  - PUT – Full update
  - PATCH – Partial update
  - DELETE – Remove

- Return proper HTTP status codes

- All endpoints must:
  - Validate request body
  - Validate params
  - Validate query
  - Use centralized response format
  - Use global error handling

---

## 5. Validation Rules

- Use **Joi**
- Define validation schemas per endpoint
- Validation must happen before controller execution
- Reject invalid requests immediately
- Do not execute controller logic if validation fails
- Return structured error response

---

## 6. Centralized Response Structure

### Success Response

```
{
  status: boolean,
  message: string,
  data: T
}
```

Rules:

- `status` must be true
- `data` included only when applicable
- No additional fields

---

### Error Response

```
{
  status: boolean,
  message: string
}
```

Rules:

- `status` must be false
- Do not expose stack traces
- Do not include extra fields

---

## 7. Global Error Handling

- Implement centralized error handler in `middleware/errorHandler.ts`
- All errors must pass through it
- Controllers must not send error responses directly
- Handle:
  - Validation errors
  - Not found errors
  - Internal server errors

- Always return structured error format

---

## 8. CORS Configuration

- Enable CORS globally in `app.ts`
- Allow JSON content-type
- Support preflight requests
- Use proper configuration

---

## 9. In-Memory Storage Rules

- No database usage
- No file-based persistence
- No external storage services
- Storage resets on server restart
- Use strictly typed storage
- Encapsulate storage inside models

---

## 10. Error Handling Standards

- Wrap async controller logic in try/catch
- Forward errors using `next(error)`
- Use meaningful error messages
- Use correct HTTP status codes
- Never leak internal implementation details

---

## 11. Code Quality Standards

- No `any` type
- Use interfaces and generics properly
- Follow consistent naming conventions
- Small, single-responsibility functions
- Avoid duplication
- Maintain readability and scalability

---

## 12. Strict Prohibitions

- Do not introduce database integration
- Do not modify project structure
- Do not bypass Joi validation
- Do not send raw responses
- Do not implement business logic in routes
- Do not skip global error handler
- Do not modify unrelated files
- Do not assume unspecified requirements
