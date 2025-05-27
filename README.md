# 🧱 Form Builder App

A simple but extensible form builder that allows users to dynamically create and preview forms with various field types.  
Originally built for a take-home challenge and recently modernized to align with current best practices using TypeScript and Material UI v5.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript
- **Styling/UI**: Material UI v5
- **State Management**: React Hooks
- **Bundler/Tooling**: Create React App
- **Planned Infrastructure**: AWS S3 + CloudFront for hosting, CDK for infrastructure-as-code

## 🧩 Existing Features

- Add text inputs, dropdowns, and more
- Live preview as you build your form
- Reorder or remove fields
- Form submission and response logging

## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-user/s20-form-builder.git
cd s20-form-builder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app locally

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

> If you're using Node.js v17+, the following environment variable may be required:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

### 4. Clone the backend repo:

```bash
git clone https://github.com/jaimish11/s20-form-builder-api.git
cd s20-form-builder-api
```

### 5. Install packages and start:

```bash
npm install && npm start
```

## 🎥 Demo

> [Watch the demo video here](https://www.loom.com/share/66dfb5a20d22447eb1e4f6fdf522107c?sid=e6125760-27e2-4cec-8e11-62d7af87cba2)  
> _(Recorded before MUI upgrade — some visual polish still in progress)_

## 🔭 Future Improvements

- [ ] Add more field types: file upload, textarea, datepicker
- [ ] Improve mobile responsiveness
- [ ] Add visual improvements post-MUI v5 upgrade
- [ ] Add AWS CDK-based infrastructure setup
- [ ] Add basic testing (form logic, UI behavior)

## 🛠️ Architecture Notes

- The app was originally built with React + JavaScript and later refactored to use **TypeScript** for type safety and maintainability.
- UI was upgraded to **Material UI v5**, with minor layout and style tweaks still in progress.
- Designed to be **stateless on the frontend** and integrates with a backend for submission handling.

## 🤝 Contribution & Scope

That said, the architecture and implementation decisions are documented for transparency and learning purposes. Suggestions and/or improvements are always welcome.
