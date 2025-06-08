<div align="center">
  <h1>REV ERP/CRM</h1>
  <p>Fork of the IDURAR ERP/CRM open source project.</p>
</div>

---

## 📦 About

**REV ERP/CRM** is an open-source ERP & CRM application derived from [IDURAR](https://github.com/idurar/idurar-erp-crm), designed to handle invoicing, quotes, payments, and customer management. This project is built using the **MERN** stack and includes support for internationalization.

This fork introduces:
- Initial support for **Spanish** language (i18n)
- Updated branding and UI adjustments
- Planned modular refactors for maintainability

---

## 🧱 Tech Stack

- **Frontend**: React.js, Redux, Ant Design (AntD)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based
- **Internationalization**: i18next (initial setup includes English and Spanish)

---

## 🚀 Getting Started

# Getting Started with `rev-erp-crm`

## Step 1: Clone the Repository

```bash
git clone https://github.com/cecuchetti/rev-erp-crm.git
cd rev-erp-crm
```

---

## Step 2: Create Your MongoDB Account and Cluster

- Go to [MongoDB Atlas](https://www.mongodb.com/) and create a free account.
- Create a new cluster and database.
- Copy your connection URI (be sure to replace `<password>` with your actual password).
- Add your current IP address to the IP whitelist.

---

## Step 3: Configure Environment Variables

- Go to the `/backend` directory.
- Locate the `.env` file (or copy `.env.example` if needed).
- Update the `DATABASE` variable with your MongoDB URI:

```env
DATABASE="your-mongodb-uri"
```

---

## Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 5: Run Setup Script

This will initialize database content or any first-time setup:

```bash
npm run setup
```

---

## Step 6: Start the Backend Server

```bash
npm run dev
```

The backend server will run on `http://localhost:5000` (by default).

---

## Step 7: Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

---

## Step 8: Run the Frontend Server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the app in your browser.

---

## ⚠️ Troubleshooting OpenSSL Errors (Node.js 17+)

If you get an OpenSSL-related error, try the following fixes:

### ✅ Option 1: Use Node.js 20+

Upgrade to the latest stable Node version.

---

### 🔧 Option 2: Enable Legacy OpenSSL Provider

#### On Unix/macOS:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

#### On Windows (CMD):

```bash
set NODE_OPTIONS=--openssl-legacy-provider
```

#### On PowerShell:

```bash
$env:NODE_OPTIONS = "--openssl-legacy-provider"
```

Then re-run:

```bash
npm run dev
```

For more help, see [this StackOverflow thread](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported).

---


---

## 🔐 License

This project is based on IDURAR and follows the [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html) license.

---

## 🌐 Original Source

- **Upstream Repository**: [github.com/idurar/idurar-erp-crm](https://github.com/idurar/idurar-erp-crm)
