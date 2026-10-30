# Online Application & Registration Web Portal

An interactive, responsive online application and registration web application built with **HTML5, CSS3, JavaScript, jQuery, and PHP**.

Upon form submission (button click), user data is validated client-side with jQuery, submitted asynchronously to PHP via AJAX, validated and sanitized on the server, and displayed dynamically as a **formatted, stylized official acknowledgement receipt** directly in the browser with one-click print and PDF export capabilities.

---

## 🚀 Features

- **Semantic HTML5 Form**:
  - Personal Information (First Name, Last Name, Email, Phone, Date of Birth, Gender)
  - Academic Details (Program / Course Selection, Qualification)
  - Address & Communication (Address, City, Postal Code, Remarks)
  - Legal declaration check
- **CSS3 Styling & Print Formatting**:
  - Clean card-based design with custom gradients, badges, and focus transitions.
  - Fully mobile-responsive.
  - Dedicated `@media print` rules: cleanly formats and prints the acknowledgement slip onto A4 paper or PDF while stripping away web navigation buttons and background banners.
- **Client-Side Interactivity (JavaScript & jQuery)**:
  - Form validation (regex checks for email, 10-digit phone, 6-digit postal code, age check).
  - Live feedback (clears error states when typing).
  - AJAX submission (`$.ajax`) with a dynamic loading spinner.
  - DOM manipulation to display the stylized acknowledgement card smoothly.
  - "Print / Save PDF" handler (`window.print()`).
  - "Submit Another Registration" reset flow.
- **Backend (PHP)**:
  - Input sanitization (`trim`, `stripslashes`, `htmlspecialchars`).
  - Server-side email and regex validation.
  - Auto-generated Application Reference Number (`APP-2026-XXXX`).
  - Formatted timestamps and date processing.
  - Returns structured JSON for AJAX and fallback styled HTML for standard POST.

---

## 📁 File Structure

```text
web-tech/
│
├── index.html       # Main registration form & confirmation card layout
├── style.css        # Responsive styling & @media print stylesheet
├── script.js        # jQuery form validation, AJAX submission & DOM handler
├── process.php      # PHP backend (sanitization, validation, ID generator)
├── server.js        # Built-in zero-dependency Node.js test server
├── Dockerfile       # Container definition (PHP 8.2 + Apache) for cloud deployment
├── render.yaml      # Blueprint for 1-click deploy to Render.com
├── vercel.json      # Configuration for Vercel deployment
└── README.md        # Documentation and deployment guide
```

---

## 💻 How to Run Locally

### Option 1: Instant Preview with Node.js (Easiest - No XAMPP needed!)
You already have Node.js installed on your computer. Simply run:
```bash
node server.js
```
Then open your browser at:
👉 **`http://localhost:3000`**

### Option 2: Using PHP Built-in Server
If PHP is installed or via XAMPP command prompt:
```bash
php -S localhost:8000
```
Then open:
👉 **`http://localhost:8000`**

### Option 3: Using XAMPP / WampServer / Laragon
1. Copy the `web-tech` folder into your `htdocs` directory (e.g., `C:\xampp\htdocs\web-tech`).
2. Start Apache from the XAMPP Control Panel.
3. Open `http://localhost/web-tech/index.html` in your browser.

---

## ☁️ How to Host on Cloud Platforms (Free)

### Method 1: Deploy on Render.com (Recommended - 100% Free with Docker)
1. Create a free account at [Render.com](https://render.com).
2. Upload this `web-tech` folder to a GitHub repository.
3. In Render dashboard, click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Render will automatically detect the `Dockerfile`.
6. Click **Create Web Service**. Within 2 minutes, you will get a free live URL (e.g., `https://eduportal-registration.onrender.com`).

---

### Method 2: Deploy on InfinityFree (Instant Traditional PHP Hosting - No Credit Card)
1. Sign up for a free account at [InfinityFree](https://www.infinityfree.com).
2. Create a free account and choose a free domain (e.g., `yourname.infinityfreeapp.com`).
3. Open the **Online File Manager** (cPanel).
4. Navigate to the `htdocs` folder.
5. Upload `index.html`, `style.css`, `script.js`, and `process.php`.
6. Visit your domain — your live PHP web app is immediately active!

---

### Method 3: Deploy on Railway.app
1. Go to [Railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select this repository. Railway will detect the `Dockerfile` and deploy it instantly.
