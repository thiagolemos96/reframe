# 🖼️ Digital Photo Frame (iPad Frame)

> Turn your old iPad or tablet into a modern, functional piece of decoration.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Offline-success?style=for-the-badge)
[![Deploy](https://img.shields.io/badge/Access_Website-Live_Demo-success?style=for-the-badge&logo=safari&logoColor=white)](https://thiagolemos96.github.io/reframe/)

## 📖 About the Project

This project is a **Web Application (PWA)** designed to run on mobile devices, with a special focus on giving a new purpose to older hardware (like the **iPad Mini 2**).

Unlike standard websites, this app is optimized to work **100% Offline**. It utilizes the browser's **IndexedDB** to store hundreds of photos locally, bypassing the standard LocalStorage limitations.

### 🎯 The Problem
Old tablets often become too slow for modern web browsing or lose support for mainstream photo apps. This project creates a lightweight and internet-independent slideshow.

---

## ✨ Features

* **📸 Infinite Slideshow:** Add photos directly from your local gallery.
* **💾 Persistent Storage:** Photos are saved to the device's disk via IndexedDB (they remain saved even after closing the tab).
* **✈️ Offline Mode (PWA):** Install as a native app and use without Wi-Fi.
* **⚙️ Customization:**
    * Transition time control.
    * Effects (Ken Burns Zoom, Fade).
    * Image fit (Cover screen or Contain image).
* **🕰️ Info Widget:** Displays clock, date, and weather (Weather requires internet).
* **⚡ Legacy Optimized:** Configured to run on older Safari versions (iOS 12+).

---

## 🚀 Tech Stack

* **[React](https://reactjs.org/)** - Library for building the user interface.
* **[Vite](https://vitejs.dev/)** - Fast and optimized build tool.
* **IndexedDB** - In-browser database for storing large amounts of data (Blobs/Base64).
* **Vite PWA Plugin** - Transforms the site into an installable, offline-capable app.
* **Vite Legacy Plugin** - Ensures compatibility with older iOS versions.

---

## 📦 Installation & Setup (Development)

To run this project locally on your machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/thiagolemos96/reframe.git](https://github.com/thiagolemos96/reframe.git)
    cd reframe
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Access `http://localhost:5173` in your browser.

---

## 📲 How to use on iPad

1.  Access the hosted project [link](https://thiagolemos96.github.io/reframe/) via Safari on your iPad.
2.  Wait for the initial loading (Loading Screen).
3.  Tap the **Share** button (square with an arrow pointing up).
4.  Select **"Add to Home Screen"**.
5.  Open the newly created icon on your home screen.
6.  **Add your photos** and turn off Wi-Fi if you wish!

---

## 🤖 How to use on Android

1.  Access the hosted project [link](https://thiagolemos96.github.io/reframe/) via **Google Chrome**.
2.  Wait for the initial loading.
3.  Tap the **Three Dots Menu** (⋮) in the top right corner.
4.  Select **"Install App"** or **"Add to Home Screen"**.
5.  Tap **Install** to confirm.
6.  Open the app from your home screen or app drawer.

---

## 🛠️ Useful Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local server. |
| `npm run build` | Generates the final optimized version in the `dist` folder. |
| `npm run preview` | Tests the final build locally. |
| `npm run deploy` | Deploys the final version to GitHub Pages. |

---

## ⚠️ Important Notes

* **Weather:** The weather feature consumes an external API. It will not work if the device is Offline.
* **Performance:** When adding many photos (e.g., +50) at once on very old devices (iPad Mini 2/3), the browser might reload due to limited RAM. It is recommended to add photos in batches of 10 or 20.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

Made with 💙 to revive old gadgets.


## 📝 TODO

* Edit Clock modal style (eg change position, change shape)
* Change photo by clicking in the sides 