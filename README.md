# 📍 iTour - Interactive Campus Navigation App (Alpha)

&#x20;  &#x20;

> 🚧 **Note:** This project is currently in **Alpha** and under active development. Core functionality is experimental and may break or change frequently.

---

## 🎯 Project Overview

**iTour** is an immersive, web-based campus navigation tool built as a Progressive Web App (PWA). Designed to help users explore the Caraga State University campus in 3D, it features a combination of A-Frame visualizations, search capabilities, and navigation tools optimized for mobile and web.

---

## ✅ Current Features (Alpha)

- 🗺️ 3D Campus Map using **A-Frame**
- 🕹️ Basic **Joystick Controls** via nippleJS
- 🔍 **Expandable Search Menu**
- 📦 PWA groundwork using `vite-plugin-pwa`
- 🧡 Initial waypoints and navigation graph setup

---

## 💠 Planned Features

- 📌 Google Places autocomplete integration
- 📍 Dynamic navigation path (line drawing on map)
- 🔄 Toggle between standard & aerial views
- 📀 Full offline support and installable app experience
- 📸 More refined UI and custom 3D models

---

## 📸 Screenshots *(Coming Soon)*

> *Screenshots will be added once the UI is more stable.*

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/angelogalope/iTour.git
cd iTour
yarn install
```

### 2. Run the App

```bash
yarn dev
```

### 3. Preview Build (Optional)

```bash
yarn build
yarn preview
```

---

## 🧾 Project Structure

```
src/
├── assets/             # 3D models, images
├── components/         # UI components (SearchMenu, Carousel, etc.)
├── screens/MapScreen/  # Main 3D scene using A-Frame
├── routes/graph.js     # Navigation path logic
├── waypoints.js        # Static location data
├── App.jsx             # Root component
└── main.jsx            # Entry point for Vite
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📜 License

Licensed under the [MIT License](LICENSE).

---

## 📬 Author

**Angelo Galope**\
[GitHub](https://github.com/angelogalope)

