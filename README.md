# MergeMoney – Client Side

## Live Demo

[Live Demo](https://expense-react-client-nine.vercel.app/)

## Environment Variables

Create a `.env` file in the root directory of the client project:

```
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_SECERET=
VITE_SERVER_ENDPOINT=
VITE_RAZORPAY_KEY_ID=
```



### Variable Explanation

VITE_GOOGLE_CLIENT_ID
Google OAuth Client ID used for enabling Google Sign-In in the frontend application.

VITE_GOOGLE_CLIENT_SECERET
Google OAuth Client Secret (only required if directly used on client, otherwise recommended to keep it server-side for security).

VITE_SERVER_ENDPOINT
Base URL of the backend API (e.g., [http://localhost:5000](http://localhost:5000) or production server URL).

VITE_RAZORPAY_KEY_ID
Public Razorpay key used for initializing Razorpay checkout in the frontend.

---

## Important Notes

* All environment variables must start with `VITE_` to be accessible in a Vite application.
* Never expose sensitive secrets in production builds.
* Google Client Secret and Razorpay Secret should ideally remain only on the server side.
* Restart the development server after updating `.env`.

---

## Running the Client

```
npm install
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---


