## Project Context

This project is a TypeScript-based Express backend application with the following structure:

```
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── models/
```

Copilot must follow the architecture and constraints defined below.

---

## General Development Rules

- Use **TypeScript strict mode** standards.
- Use proper **ES module imports**.
- Maintain **clean architecture separation**:
  - Routes → Controllers → Models

- Do not introduce any database or ORM.
- Use **in-memory storage only**.
- Do not modify files outside the defined scope unless explicitly required.
- If any requirement is unclear or missing, request clarification instead of assuming.
- Ensure to use UUID v4 for all unique identifiers.

---

## API Design Standards

- All endpoints must follow **REST API standards**.
- Use plural resource naming.
- Use appropriate HTTP methods:
  - `GET` – Fetch data
  - `POST` – Create
  - `PUT` – Update (full)
  - `PATCH` – Partial update
  - `DELETE` – Remove

- Return appropriate HTTP status codes.
- Every endpoint must:
  - Validate input usinf Joi validations.
  - Use centralized response format
  - Handle errors via global error handler

---

## Folder Responsibilities

### routes/

- Define API endpoints only.
- Do not include business logic.
- Attach Joi validation middleware before controller execution.
- Forward all errors using `next()` to global error handler.
- Export router as default.

---

### controllers/

- Contain only business logic.
- Must not contain validation schema definitions.
- Must not send raw responses.
- Must use centralized response structure.
- Must properly handle async errors using `try/catch` and forward to `next()`.

---

### models/

- Define TypeScript interfaces for all entities.
- Use proper typing.
- Define request and response DTO types where required.
- Maintain in-memory storage using:
  - `Map`
  - or `Array`

- Storage must be encapsulated and not directly mutated from outside controllers.

---

## Validation Requirements

- Use **Joi** for validation.
- Create Joi schemas per endpoint.
- Validate:
  - Request body
  - Request params
  - Query parameters

- Reject invalid requests with structured error response.
- Do not process controller logic if validation fails.

---

## Centralized Response Structure

All API responses must strictly follow this structure:

### Success Response

```
{
  status: boolean,
  message: string,
  data: T
}
```

### Error Response

```
{
  status: boolean,
  message: string
}
```

Rules:

- Do not change keys.
- Do not add extra fields.
- Always return consistent structure.
- `data` must only be included when applicable.

---

## Global Error Handling

- Use a centralized error handling middleware in `middleware/errorHandler.ts`.
- All errors must pass through global error handler.
- Do not send error responses directly from controllers.
- Handle:
  - Validation errors
  - Not found errors
  - Internal server errors

- Return structured error response format only.

---

## CORS

- Enable CORS globally in `app.ts`.
- Use proper configuration.
- Allow JSON content-type.
- Ensure preflight support.

---

## In-Memory Storage Rules

- No database usage.
- No external persistence.
- Use TypeScript-typed storage.
- Storage must be initialized in memory and reset on server restart.
- Controllers interact with storage through defined models.

---

## Error Handling Standards

- Always wrap async controller logic in try/catch.
- Forward errors using `next(error)`.
- Do not expose internal stack traces.
- Return meaningful error messages.
- Use proper HTTP status codes.

---

## Code Quality Standards

- Use strict typing everywhere.
- Avoid `any`.
- Use interfaces and generics properly.
- Follow consistent naming conventions.
- Keep functions small and single-responsibility.
- Avoid duplication.

---

## What Not To Do

- Do not introduce database integration.
- Do not change project structure.
- Do not bypass Joi validation.
- Do not send raw `res.json()` without centralized format.
- Do not implement business logic inside routes.
- Do not ignore global error handler.
- Do not modify unrelated files.
- Do not assume requirements that are not specified.
