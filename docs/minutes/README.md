# Meeting Minutes - E-commerce Project - follow up

## Meeting #1

### Agenda
- Business modeling and database design
- Technology stack selection

### Discussion Points

#### 1. Business Modeling
- Defined main business classes and entities
- Identified primary keys for database tables
- Established relationships between entities

#### 2. Framework Selection
- **Frontend:** React was selected for its component-based architecture and large community support
- **Backend:** Express.js was chosen for its lightweight nature and Node.js ecosystem compatibility
- Consensus reached on using a modern JavaScript/TypeScript stack

#### 3. Database Selection
- **Database:** MySQL selected as the relational database management system
- Decision based on reliability, performance, and team familiarity

### Decisions Made
- ✅ Use React for frontend development
- ✅ Use Express.js for backend API
- ✅ Use MySQL as database

---

## Meeting #2

### Agenda
- Project boilerplate review
- Database schema presentation
- UI component library selection
- User role definition

### Discussion Points

#### 1. Boilerplate Presentation
- Presented initial project structure with React and Express
- Reviewed folder organization and configuration files
- Discussed development workflow and best practices

#### 2. Database Schema
- Presented complete database schema with all tables and relationships
- Reviewed entity relationships and foreign keys
- Validated data types and constraints

#### 3. Component Libraries
- Evaluated multiple React component libraries
- Selected two complementary libraries for UI development
- Discussed design consistency and customization capabilities

#### 4. User Types Definition
- **Admin:** Full system access, user management, product management
- **Receptionist:** Order management, customer service functions
- **Client:** Browse products, place orders, view order history

### Decisions Made
- ✅ Approved database schema design
- ✅ Selected two React component libraries for UI
- ✅ Defined three user roles: Admin, Receptionist, and Client

---

## Meeting #3

### Agenda
- Payment gateway selection
- Authentication implementation review
- API testing strategy

### Discussion Points

#### 1. Payment Gateway
- Evaluated payment processing options
- **Decision:** Mercado Pago selected as the sole payment method
- Discussed integration requirements and API documentation

#### 2. Login Implementation
- **Backend:** Authentication endpoints completed with JWT tokens
- **Frontend:** Login forms and authentication flow implemented
- Reviewed security measures and password handling

#### 3. API Testing
- Consensus reached on using Postman for endpoint testing
- Discussed importance of comprehensive API documentation
- Agreed on testing procedures for all endpoints

### Decisions Made
- ✅ Mercado Pago as payment gateway
- ✅ JWT-based authentication implemented
- ✅ Postman as standard tool for API testing

---

## Meeting #4

### Agenda
- Product and catalog CRUD implementation
- Search functionality
- Alternative authentication methods

### Discussion Points

#### 1. Product and Catalog CRUD
- **Backend:** Complete CRUD operations for products implemented
- **Frontend:** Product management interface and catalog display completed
- Tested create, read, update, and delete operations

#### 2. Search Bar Implementation
- Implemented search functionality for product catalog
- Added filtering capabilities
- Discussed user experience improvements

#### 3. Google Authentication API
- **Decision:** Integrate Google Sign-In for enhanced user experience
- Discussed OAuth 2.0 implementation
- Planned integration alongside existing email/password authentication

### Decisions Made
- ✅ Product CRUD fully functional on backend and frontend
- ✅ Search bar implemented in catalog
- ✅ Google Sign-In API will be integrated

---

## Meeting #5

### Agenda
- Admin and receptionist interface development
- Google API integration status
- Payment gateway reconsideration

### Discussion Points

#### 1. Admin and Receptionist Screens
- Developed complete dashboards for Admin users
- Created receptionist interface with order management capabilities
- Implemented role-based UI rendering

#### 2. Google API Integration
- Successfully implemented Google Sign-In
- Tested authentication flow with Google accounts
- Verified proper user creation and token management

#### 3. Payment Gateway Change
- **Major Decision:** Switch from Mercado Pago to Stripe
- Reasons: Better documentation, wider international support, more robust API
- Discussed migration timeline and implementation requirements

### Decisions Made
- ✅ Admin and receptionist interfaces completed
- ✅ Google Sign-In API successfully integrated
- ✅ Switch payment gateway from Mercado Pago to Stripe

---

## Meeting #6

### Agenda
- Order management system
- Stripe payment integration completion

### Discussion Points

#### 1. Order CRUD Implementation
- Developed complete order management system
- **Backend:** Order creation, retrieval, updates, and status management
- **Frontend:** Order interfaces for all user types
- Implemented order history and tracking

#### 2. Stripe Integration
- Successfully integrated Stripe payment processing
- Implemented payment flow from cart to confirmation
- Tested payment webhooks and order status updates
- Configured Stripe dashboard for transaction monitoring

### Decisions Made
- ✅ Order CRUD system fully operational
- ✅ Stripe payment gateway successfully integrated and tested

