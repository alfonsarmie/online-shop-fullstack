# API Documentation - Backend

## Module: Users (`/api/users`)

### **POST /api/users**
Creates a new user.

**Headers:**
- `x-token` *(optional for clients, required for staff creation)*: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "dni": "number",
  "email": "string",
  "name": "string",
  "surname": "string",
  "password": "string",
  "role": "client | admin | receptionist"
}
```

**Responses:**
- `201 Created`: User successfully created.
- `400 Bad Request`: Invalid data or incorrect role.
- `403 Forbidden`: Admin token required to create staff users.
- `500 Internal Server Error`: Error creating the user or sending the activation email.

**Response Example (201):**
```json
{
  "message": "User successfully created",
  "user": {
    "idUser": 1,
    "dni": 12345678,
    "email": "john.doe@example.com",
    "name": "John",
    "surname": "Doe",
    "role": "client",
    "status": "pending"
  }
}
```

---

### **GET /api/users/activate/:token**
Activates a user account using an activation token sent by email.

**Path Parameters:**
- `token` (string): Unique activation token.

**Responses:**
- Redirects to `http://localhost:5173/activate/:token` on success.
- Redirects with `?error=invalid_token` or `?error=server_error` on failure.

**Response:**
- On success: HTTP 302 redirect to `http://localhost:5173/activate/:token`
- On failure: HTTP 302 redirect to `http://localhost:5173/activate/:token?error=invalid_token`

---

### **DELETE /api/users/:id**
Deletes a user (soft delete, changes status to `deleted`).

**Path Parameters:**
- `id` (number): User ID.

**Responses:**
- `200 OK`: User successfully deleted.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Error deleting the user.

**Response Example (200):**
```json
{
  "message": "User successfully deleted"
}
```

---

### **PUT /api/users/:id**
Updates a user's information.

**Path Parameters:**
- `id` (number): User ID.

**Body (JSON):**
```json
{
  "name": "string",
  "surname": "string",
  "email": "string",
  "dni": "number | null"
}
```

**Responses:**
- `200 OK`: User successfully updated.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Error updating the user.

**Response Example (200):**
```json
{
  "message": "User successfully updated",
  "user": {
    "idUser": 1,
    "dni": 87654321,
    "email": "john.updated@example.com",
    "name": "John",
    "surname": "Smith",
    "role": "client",
    "status": "active"
  }
}
```

---

### **PATCH /api/users/change-password**
Allows an authenticated user to change their password.

**Body (JSON):**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Headers:**
- `x-token`: Valid JWT token.

**Responses:**
- `200 OK`: Password successfully updated.
- `400 Bad Request`: Incorrect current password or new password is the same as the old one.
- `401 Unauthorized`: Missing or invalid token.
- `404 Not Found`: User not found.
- `500 Internal Server Error`: Error updating the password.

**Response Example (200):**
```json
{
  "message": "Password successfully updated"
}
```

---

### **POST /api/users/reset-password**
Sends an email with a password reset link.

**Body (JSON):**
```json
{
  "email": "string"
}
```

**Responses:**
- `200 OK`: Password reset email sent.
- `404 Not Found`: User not found or inactive.
- `500 Internal Server Error`: Error sending the email or generating the token.

**Response Example (200):**
```json
{
  "message": "Password reset email sent successfully"
}
```

---

### **POST /api/users/reset/:token**
Resets a user's password using a reset token.

**Path Parameters:**
- `token` (string): Unique password reset token.

**Body (JSON):**
```json
{
  "newPassword": "string"
}
```

**Responses:**
- `200 OK`: Password successfully reset.
- `400 Bad Request`: Invalid or expired token.
- `500 Internal Server Error`: Error updating the password.

**Response Example (200):**
```json
{
  "message": "Password successfully reset"
}
```

---

## User Status
- `pending`: Awaiting activation.
- `active`: Account is active.
- `deleted`: Soft deleted.

---

## Notes
- All emails are sent using **Nodemailer** and an account configured with `EMAIL_USER` and `EMAIL_PASS` environment variables.
- JWT tokens are signed with `JWT_SECRET` and must be included in the `x-token` header.

---

## Module: Authentication (`/api/auth`)

### **POST /api/auth/login**
Authenticates a user with email and password.

**Body (JSON):**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**
- `200 OK`: User successfully authenticated.
- `400 Bad Request`: 
  - No account found with the provided email.
  - Incorrect password.
  - Account not activated (inactive status).
- `500 Internal Server Error`: Server error during authentication.

**Response Example (200):**
```json
{
  "message": "Login successful",
  "user": {
    "idUser": 1,
    "dni": 12345678,
    "email": "john.doe@example.com",
    "name": "John",
    "surname": "Doe",
    "role": "client",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **POST /api/auth/google**
Authenticates or registers a user via Google Sign-In.
- Expects a valid Google ID token from the client.
- Verifies the token using Google's API.
- If the user does not exist, creates a new account using data provided by Google.
- If the account exists and is active, generates a JWT.

**Body (JSON):**
```json
{
  "id_token": "string"
}
```


**Responses:**
- `200 OK`: Successful Google authentication.
- `400 Bad Request`: Invalid Google token or verification failure.
- `401 Unauthorized`: The user's account exists but is not active.
- `500 Internal Server Error`: Server-side error during Google authentication.

**Response Example (200 - Existing user):**
```json
{
  "message": "Google authentication successful",
  "user": {
    "idUser": 2,
    "email": "jane.smith@gmail.com",
    "name": "Jane",
    "surname": "Smith",
    "role": "client",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Example (200 - New user created):**
```json
{
  "message": "User created via Google authentication",
  "user": {
    "idUser": 3,
    "email": "new.user@gmail.com",
    "name": "New",
    "surname": "User",
    "role": "client",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Notes
- All authentication tokens are **JWTs** generated via the `generateJWT()` helper.
- Google Sign-In tokens are verified using the `googleVerify()` helper.
- Accounts created through Google Sign-In are automatically marked as `active`.
- Passwords for Google accounts are stored as placeholders (`":P"`) since login relies on OAuth.

---

## Module: Products (`/api/products`)

### **POST /api/products**
Creates a new product along with its images, prices, and sizes.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "name": "string",
  "description": "string",
  "stock": "number",
  "idCategory": "number",
  "initialPrice": "number (optional)",
  "images": [
    {
      "url": "string",
      "description": "string (optional)"
    }
  ],
  "sizes": ["number (size IDs)"]
}
```

**Responses:**
- `201 Created`: Product successfully created with all associated data.
- `400 Bad Request`: Category not found or invalid data.
- `500 Internal Server Error`: Error while creating the product.

**Response Example (201):**
```json
{
  "message": "Product created successfully",
  "product": {
    "idProduct": 1,
    "name": "Classic Cotton T-Shirt",
    "description": "Soft and breathable cotton t-shirt",
    "stock": 50,
    "category": {
      "idCategory": 1,
      "name": "Clothing"
    },
    "prices": [
      {
        "idProduct": 1,
        "value": 2999,
        "updateDate": "2025-10-28T10:00:00.000Z"
      }
    ],
    "images": [
      {
        "url": "/uploads/image-1757712165212-162394935.jpg",
        "description": "Front view"
      },
      {
        "url": "/uploads/image-1757713332838-709404748.jpg",
        "description": "Back view"
      }
    ],
    "sizes": [
      { "idSize": 1, "sizeDesc": "S" },
      { "idSize": 2, "sizeDesc": "M" },
      { "idSize": 3, "sizeDesc": "L" }
    ]
  }
}
```

---

### **GET /api/products**
Retrieves all products, optionally filtered by a search term.

**Query Parameters:**
- `search` (string, optional): Filters products by partial name or description.

**Responses:**
- `200 OK`: Returns a list of all products with their latest price, up to two images, and category data.
- `500 Internal Server Error`: Error fetching products.

**Response Example (200):**
```json
{
  "products": [
    {
      "idProduct": 1,
      "name": "Classic Cotton T-Shirt",
      "description": "Soft and breathable cotton t-shirt",
      "stock": 50,
      "category": { "idCategory": 1, "name": "Clothing" },
      "prices": [
        { "idProduct": 1, "value": 2999, "updateDate": "2025-10-28T10:00:00.000Z" }
      ],
      "images": [
        { "url": "/uploads/image1.jpg", "description": "Front view" },
        { "url": "/uploads/image2.jpg", "description": "Back view" }
      ],
      "sizes": [
        { "idSize": 1, "sizeDesc": "S" },
        { "idSize": 2, "sizeDesc": "M" }
      ]
    }
  ]
}
```

---

### **GET /api/products/:id**
Retrieves detailed information about a specific product.

**Path Parameters:**
- `id` (number): Product ID.

**Responses:**
- `200 OK`: Returns the product with all related data (prices, images, category, and sizes).
- `404 Not Found`: Product not found.
- `500 Internal Server Error`: Error retrieving the product.

**Response Example (200):**
```json
{
  "product": {
    "idProduct": 1,
    "name": "Classic Cotton T-Shirt",
    "description": "Soft and breathable cotton t-shirt",
    "stock": 50,
    "category": { "idCategory": 1, "name": "Clothing" },
    "prices": [
      { "idProduct": 1, "value": 2999, "updateDate": "2025-10-28T10:00:00.000Z" }
    ],
    "images": [
      { "url": "/uploads/image1.jpg", "description": "Front view" },
      { "url": "/uploads/image2.jpg", "description": "Back view" }
    ],
    "sizes": [
      { "idSize": 1, "sizeDesc": "S" },
      { "idSize": 2, "sizeDesc": "M" }
    ]
  }
}
```

---

### **PUT /api/products/:id**
Updates an existing product, replacing its related data (prices, images, sizes).

**Path Parameters:**
- `id` (number): Product ID.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "stock": "number (optional)",
  "idCategory": "number (optional)",
  "initialPrice": "number (optional)",
  "images": [
    {
      "url": "string",
      "description": "string (optional)"
    }
  ],
  "sizes": ["number (size IDs, optional)"]
}
```

**Responses:**
- `200 OK`: Product successfully updated.
- `400 Bad Request`: Invalid category or data.
- `404 Not Found`: Product not found.
- `500 Internal Server Error`: Error updating the product.

**Response Example (200):**
```json
{
  "message": "Product updated successfully",
  "product": {
    "idProduct": 1,
    "name": "Premium Cotton T-Shirt",
    "description": "Updated description",
    "stock": 75,
    "category": { "idCategory": 1, "name": "Clothing" },
    "prices": [
      { "idProduct": 1, "value": 3499, "updateDate": "2025-10-28T15:00:00.000Z" }
    ],
    "images": [
      { "url": "/uploads/image-updated-1.jpg", "description": "New front view" },
      { "url": "/uploads/image-updated-2.jpg", "description": "New back view" }
    ],
    "sizes": [
      { "idSize": 2, "sizeDesc": "M" },
      { "idSize": 3, "sizeDesc": "L" },
      { "idSize": 4, "sizeDesc": "XL" }
    ]
  }
}
```

---

### **DELETE /api/products/:id**
Deletes a product and all its related data (prices, images, and sizes).

**Path Parameters:**
- `id` (number): Product ID.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Responses:**
- `200 OK`: Product deleted successfully.
- `404 Not Found`: Product not found.
- `500 Internal Server Error`: Error deleting the product.

**Response Example (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## Notes
- Product creation and update operations are executed inside **transactions** for data consistency.
- When updating, **images and sizes are fully replaced** with the new provided arrays.
- Products have a **one-to-many** relationship with prices and images, and a **many-to-many** relationship with sizes.
- The search endpoint supports **case-insensitive partial matching** on both product name and description.
- Deleting a product performs a **hard delete**, removing all associated records.

---

## Module: Sizes (`/api/sizes`)

### **POST /api/sizes**
Creates a new size.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "sizeDesc": "string"
}
```

**Responses:**
- `201 Created`: Size successfully created.
- `500 Internal Server Error`: Error creating the size.

**Response Example (201):**
```json
{
  "message": "Size created successfully",
  "size": {
    "idSize": 1,
    "sizeDesc": "M"
  }
}
```

---

### **GET /api/sizes**
Retrieves all available sizes.

**Responses:**
- `200 OK`: Returns array of all sizes.
- `500 Internal Server Error`: Error fetching sizes.

**Response Example (200):**
```json
{
  "sizes": [
    {
      "idSize": 1,
      "sizeDesc": "S"
    },
    {
      "idSize": 2,
      "sizeDesc": "M"
    },
    {
      "idSize": 3,
      "sizeDesc": "L"
    },
    {
      "idSize": 4,
      "sizeDesc": "XL"
    }
  ]
}
```

---

### **POST /api/sizes/:idProduct/:idSize**
Adds a size to a specific product.

**Path Parameters:**
- `idProduct` (number): Product ID.
- `idSize` (number): Size ID.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Responses:**
- `201 Created`: Size successfully added to product.
- `500 Internal Server Error`: Error adding size to product.

**Response Example (201):**
```json
{
  "message": "Size added to product successfully",
  "productSize": {
    "idProduct": 1,
    "idSize": 2
  }
}
```

---

## Notes
- Sizes are used to define available options for products (e.g., S, M, L, XL for clothing or numerical sizes).
- The relationship between products and sizes is many-to-many, managed through the `ProductSize` junction table.
- Size descriptions (`sizeDesc`) should be unique and descriptive (e.g., "Small", "Medium", "32", "42").

---

## Module: Categories (`/api/categories`)

### **GET /api/categories**
Retrieves all categories ordered by ID.

**Responses:**
- `200 OK`: Returns array of all categories.
- `500 Internal Server Error`: Error fetching categories.

**Response Example (200):**
```json
[
  {
    "idCategory": 1,
    "name": "Clothing"
  },
  {
    "idCategory": 2,
    "name": "Accessories"
  },
  {
    "idCategory": 3,
    "name": "Footwear"
  }
]
```

---

### **GET /api/categories/:id**
Retrieves a specific category by ID.

**Path Parameters:**
- `id` (number): Category ID.

**Responses:**
- `200 OK`: Returns category details.
- `404 Not Found`: Category not found.
- `500 Internal Server Error`: Error fetching category.

**Response Example (200):**
```json
{
  "idCategory": 1,
  "name": "Clothing"
}
```

---

### **POST /api/categories**
Creates a new category.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "name": "string"
}
```

**Responses:**
- `201 Created`: Category successfully created.
- `400 Bad Request`: Name is required or category already exists.
- `500 Internal Server Error`: Error creating category.

**Response Example (201):**
```json
{
  "idCategory": 4,
  "name": "Electronics"
}
```

---

### **PUT /api/categories/:id**
Updates an existing category.

**Path Parameters:**
- `id` (number): Category ID.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "name": "string"
}
```

**Responses:**
- `200 OK`: Category successfully updated.
- `400 Bad Request`: Name is required or already exists in another category.
- `404 Not Found`: Category not found.
- `500 Internal Server Error`: Error updating category.

**Response Example (200):**
```json
{
  "idCategory": 1,
  "name": "Apparel"
}
```

---

### **DELETE /api/categories/:id**
Deletes a category.

**Path Parameters:**
- `id` (number): Category ID.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Responses:**
- `200 OK`: Category successfully deleted.
- `404 Not Found`: Category not found.
- `500 Internal Server Error`: Error deleting category.

**Response Example (200):**
```json
{
  "message": "Categoría eliminada correctamente"
}
```

---

## Notes
- Category names must be unique.
- Categories are ordered by ID in ascending order when retrieved.
- Deleting a category is a hard delete.

---

## Module: Images (`/api/images`)

### **POST /api/images/:idProduct**
Adds an image to a specific product.

**Path Parameters:**
- `idProduct` (number): Product ID.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "url": "string",
  "description": "string (optional)"
}
```

**Responses:**
- `201 Created`: Image successfully added.
- `404 Not Found`: Product not found.
- `500 Internal Server Error`: Error adding image.

**Response Example (201):**
```json
{
  "message": "Image added successfully",
  "image": {
    "idImage": 1,
    "idProduct": 1,
    "url": "https://example.com/product-image.jpg",
    "description": "Front view of the product"
  }
}
```

---

### **GET /api/images/:idProduct**
Retrieves all images for a specific product.

**Path Parameters:**
- `idProduct` (number): Product ID.

**Responses:**
- `200 OK`: Returns array of product images.
- `500 Internal Server Error`: Error fetching images.

**Response Example (200):**
```json
{
  "images": [
    {
      "idImage": 1,
      "idProduct": 1,
      "url": "https://example.com/product-front.jpg",
      "description": "Front view"
    },
    {
      "idImage": 2,
      "idProduct": 1,
      "url": "https://example.com/product-back.jpg",
      "description": "Back view"
    }
  ]
}
```

---

### **DELETE /api/images/:idProduct/:url**
Deletes a specific image from a product.

**Path Parameters:**
- `idProduct` (number): Product ID.
- `url` (string): Image URL to delete.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Responses:**
- `200 OK`: Image successfully deleted.
- `404 Not Found`: Image not found.
- `500 Internal Server Error`: Error deleting image.

**Response Example (200):**
```json
{
  "message": "Image deleted successfully"
}
```

---

## Notes
- Images are associated with products through the `idProduct` foreign key.
- Image descriptions are optional and default to an empty string.
- Images are identified by both product ID and URL for deletion.

---

## Module: Prices (`/api/prices`)

### **POST /api/prices/:idProduct**
Creates a new price entry for a product.

**Path Parameters:**
- `idProduct` (number): Product ID.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "value": "number",
  "updateDate": "string (ISO date, optional)"
}
```

**Responses:**
- `201 Created`: Price successfully created.
- `404 Not Found`: Product not found.
- `500 Internal Server Error`: Error creating price.

**Response Example (201):**
```json
{
  "message": "Price created successfully",
  "price": {
    "idPrice": 1,
    "idProduct": 1,
    "value": 49.99,
    "updateDate": "2025-10-16T14:30:00.000Z"
  }
}
```

---

### **GET /api/prices/:idProduct**
Retrieves all price history for a specific product.

**Path Parameters:**
- `idProduct` (number): Product ID.

**Responses:**
- `200 OK`: Returns array of prices ordered by date (most recent first).
- `500 Internal Server Error`: Error fetching prices.

**Response Example (200):**
```json
{
  "prices": [
    {
      "idPrice": 3,
      "idProduct": 1,
      "value": 49.99,
      "updateDate": "2025-10-16T14:30:00.000Z"
    },
    {
      "idPrice": 2,
      "idProduct": 1,
      "value": 44.99,
      "updateDate": "2025-09-15T10:00:00.000Z"
    },
    {
      "idPrice": 1,
      "idProduct": 1,
      "value": 39.99,
      "updateDate": "2025-08-01T08:00:00.000Z"
    }
  ]
}
```

---

### **PUT /api/prices/:idProduct/:updateDate**
Updates a specific price entry.

**Path Parameters:**
- `idProduct` (number): Product ID.
- `updateDate` (string): ISO date string of the price to update.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Body (JSON):**
```json
{
  "value": "number"
}
```

**Responses:**
- `200 OK`: Price successfully updated.
- `404 Not Found`: Price not found.
- `500 Internal Server Error`: Error updating price.

**Response Example (200):**
```json
{
  "message": "Price updated successfully",
  "price": {
    "idPrice": 1,
    "idProduct": 1,
    "value": 54.99,
    "updateDate": "2025-10-16T14:30:00.000Z"
  }
}
```

---

## Notes
- Prices maintain a complete history for each product with timestamps.
- If `updateDate` is not provided when creating a price, the current date is used.
- Prices are returned in descending order by update date (newest first).
- Each price entry is identified by product ID and update date combination.

---

## Module: Upload (`/api/upload`)

### **POST /api/upload**
Uploads an image file to the server.

**Headers:**
- `Content-Type`: `multipart/form-data`
- `x-token`: Valid JWT token from an admin user.

**Body (Form Data):**
- `image` (file): Image file to upload.

**Responses:**
- `200 OK`: Image successfully uploaded.
- `400 Bad Request`: No image provided or invalid file type.
- `500 Internal Server Error`: Error uploading image.

**Response Example (200):**
```json
{
  "message": "Imagen subida exitosamente",
  "url": "/uploads/image-1697456789123-987654321.jpg",
  "filename": "image-1697456789123-987654321.jpg"
}
```

---

## Notes
- Maximum file size: **5MB**.
- Accepted file types: All image formats (checked by MIME type `image/*`).
- Images are stored in the `/uploads` directory on the server.
- Filenames are generated with a unique timestamp and random suffix to prevent conflicts.
- The returned URL can be used to reference the uploaded image in product image entries.

---

## Module: Orders (`/api/orders`)

### **POST /api/orders**
Creates a new order with the provided products, quantities, and total price.

**Headers:**
- `x-token`: Valid JWT token from an authenticated user.

**Body (JSON):**
```json
{
  "idUser": "number",
  "totalPrice": "number",
  "products": [
    {
      "idProduct": "number",
      "quantity": "number",
      "price": "number"
    }
  ]
}
```

**Responses:**
- `201 Created`: Order successfully created.
- `400 Bad Request`: Invalid data or missing products.
- `500 Internal Server Error`: Error creating the order.

**Response Example (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "idOrder": 1,
    "idUser": 3,
    "totalPrice": 14997,
    "orderDate": "2025-10-28T12:30:00.000Z",
    "status": "pending",
    "products": [
      {
        "idProduct": 2,
        "name": "Classic Cotton T-Shirt",
        "quantity": 3,
        "price": 4999
      }
    ]
  }
}
```

---

### **GET /api/orders**
Retrieves all orders (admin only).

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Responses:**
- `200 OK`: Returns array of all orders with their associated users and products.
- `500 Internal Server Error`: Error fetching orders.

**Response Example (200):**
```json
{
  "orders": [
    {
      "idOrder": 1,
      "idUser": 3,
      "user": {
        "name": "John",
        "surname": "Doe",
        "email": "john.doe@example.com"
      },
      "totalPrice": 14997,
      "status": "confirmed",
      "orderDate": "2025-10-28T12:30:00.000Z",
      "products": [
        {
          "idProduct": 2,
          "name": "Classic Cotton T-Shirt",
          "quantity": 3,
          "price": 4999
        }
      ]
    }
  ]
}
```

---

### **GET /api/orders/user/:idUser**
Retrieves all orders for a specific user.

**Path Parameters:**
- `idUser` (number): User ID.

**Headers:**
- `x-token`: Valid JWT token from the same user or an admin.

**Responses:**
- `200 OK`: Returns array of user's orders with products.
- `404 Not Found`: No orders found for the user.
- `500 Internal Server Error`: Error fetching user's orders.

**Response Example (200):**
```json
{
  "orders": [
    {
      "idOrder": 3,
      "totalPrice": 8999,
      "status": "pending",
      "orderDate": "2025-10-27T17:45:00.000Z",
      "products": [
        {
          "idProduct": 5,
          "name": "Denim Jacket",
          "quantity": 1,
          "price": 8999
        }
      ]
    }
  ]
}
```

---

### **PUT /api/orders/:id**
Updates an order's status (e.g., confirmed, ready, withdrawn, cancelled).

**Path Parameters:**
- `id` (number): Order ID.

**Headers:**
- `x-token`: Valid JWT token from an admin or receptionist.

**Body (JSON):**
```json
{
  "status": "confirmed | ready | withdrawn | cancelled"
}
```

**Responses:**
- `200 OK`: Order status successfully updated.
- `400 Bad Request`: Invalid status or order cannot transition to that status.
- `404 Not Found`: Order not found.
- `500 Internal Server Error`: Error updating order status.

**Response Example (200):**
```json
{
  "message": "Order status updated successfully",
  "order": {
    "idOrder": 1,
    "status": "confirmed"
  }
}
```

---

### **DELETE /api/orders/:id**
Deletes an order (admin only).

**Path Parameters:**
- `id` (number): Order ID.

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Responses:**
- `200 OK`: Order successfully deleted.
- `404 Not Found`: Order not found.
- `500 Internal Server Error`: Error deleting the order.

**Response Example (200):**
```json
{
  "message": "Order deleted successfully"
}
```

---

## Order Status
- `pending`: Order created but not yet confirmed.
- `confirmed`: Order accepted and being prepared.
- `ready`: Order ready for pickup or delivery.
- `withdrawn`: Order completed and delivered to the user.
- `cancelled`: Order cancelled by admin or user.

---

## Notes
- Orders include associated product details with quantities and prices.
- Admin users can view all orders, while clients can only view their own.
- Order deletions are hard deletes.
- Order creation automatically generates entries in the order-product relationship table.

---

## Module: Status (`/api/status`)

### **POST /api/status/:idOrder**
Creates a new status entry for an order.

**Path Parameters:**
- `idOrder` (number): ID of the order to which the new status will be applied.

**Headers:**
- `x-token`: Valid JWT token from an admin or receptionist.

**Body (JSON):**
```json
{
  "description": "ready | confirmed | withdrawn | cancelled"
}
```

**Responses:**
- `201 Created`: Status successfully created and associated with the order.
- `400 Bad Request`: Invalid or missing description.
- `404 Not Found`: Order not found.
- `500 Internal Server Error`: Error creating the status.

**Response Example (201):**
```json
{
  "message": "Status created successfully",
  "status": {
    "idStatus": 12,
    "idOrder": 5,
    "description": "confirmed",
    "date": "2025-10-28T14:00:00.000Z"
  }
}
```

---

### **GET /api/status/:idOrder**
Retrieves all status changes for a specific order, ordered by date.

**Path Parameters:**
- `idOrder` (number): ID of the order.

**Headers:**
- `x-token`: Valid JWT token from the same user (order owner) or an admin.

**Responses:**
- `200 OK`: Returns array of all status records for the given order.
- `404 Not Found`: Order not found or has no statuses.
- `500 Internal Server Error`: Error fetching statuses.

**Response Example (200):**
```json
{
  "statuses": [
    {
      "idStatus": 1,
      "idOrder": 5,
      "description": "confirmed",
      "date": "2025-10-28T14:00:00.000Z"
    },
    {
      "idStatus": 2,
      "idOrder": 5,
      "description": "ready",
      "date": "2025-10-28T17:30:00.000Z"
    },
    {
      "idStatus": 3,
      "idOrder": 5,
      "description": "withdrawn",
      "date": "2025-10-28T19:00:00.000Z"
    }
  ]
}
```

---

### **GET /api/status**
Retrieves all status entries for all orders (admin only).

**Headers:**
- `x-token`: Valid JWT token from an admin user.

**Responses:**
- `200 OK`: Returns array of all statuses across all orders.
- `500 Internal Server Error`: Error fetching statuses.

**Response Example (200):**
```json
{
  "statuses": [
    {
      "idStatus": 1,
      "idOrder": 1,
      "description": "confirmed",
      "date": "2025-10-26T13:00:00.000Z"
    },
    {
      "idStatus": 2,
      "idOrder": 2,
      "description": "cancelled",
      "date": "2025-10-27T09:30:00.000Z"
    }
  ]
}
```

---

## Status Descriptions
- `confirmed`: Order confirmed by admin or receptionist.
- `ready`: Order is ready for pickup or delivery.
- `withdrawn`: Order collected by the customer.
- `cancelled`: Order cancelled by admin or customer.

---

## Notes
- Each order can have multiple status records (historical tracking).
- The most recent status determines the current state of the order.
- Only admins and receptionists can create new status records.
- Users can view their own order statuses but cannot modify them.
