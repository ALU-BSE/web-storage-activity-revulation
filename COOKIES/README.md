Here’s a **shortened version** with only essential details, unnecessary parts removed:

---

# 🛒 Smart Shop - Web Storage Demo



##  Description
Smart Shop is a simple e-commerce app showcasing **Cookies**, **Local Storage**, and **Session Storage** for user authentication, theme preference, cart functionality, and basic security.

 **Folder:** `COOKIES/`  
 **Repo:** [GitHub](https://github.com/ALU-BSE/web-storage-activity-revulation.git)


##  Features
- **Login (Cookies):** Sets `authToken` cookie (7-day expiry)
- **Theme Toggle (Local Storage):** Saves light/dark mode
- **Shopping Cart (Session Storage):** Cart resets on browser close
- **Security:** CSRF token, input sanitization

---

##  Folder Structure
```
COOKIES/
├── index.html     # Login Page
├── shop.html      # Shop & Cart
├── style.css
├── auth.js        # Cookies handling
├── theme.js       # Local Storage
└── cart.js        # Session Storage
```

---

##  Run the Project
```
git clone https://github.com/ALU-BSE/web-storage-activity-revulation.git
cd web-storage-activity-revulation/COOKIES
Open index.html in your browser
```

---

##  Web Storage Comparison

| Criteria         | Cookies  | Local Storage | Session Storage |
|------------------|---------|--------------|-----------------|
| Limit            | ~4KB    | 5-10MB       | 5-10MB          |
| Persistence      | Configurable | Permanent | Session-only    |
| Server Access    | Yes     | No           | No              |

---

##  Key Notes
- **HttpOnly & Secure Cookies:** Protect from XSS and secure transmission
- **Avoid storing passwords** in Local/Session storage
- **Session storage clears** on tab/browser close
- **Quota Exceeded Error:** If storage limit exceeds

---

##  Final Integration
✔️ Login (Cookies)  
✔️ Theme Preference (Local Storage)  
✔️ Cart (Session Storage)  
✔️ CSRF Token & Input Sanitization

## Contributors

Group Members: 
- Uwonkunda Vanessa

- Mukunzi Patrick

- Pendo Vestine

- Khalid Abdillahi

