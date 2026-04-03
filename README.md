# Zorvyn — Advanced Finance Dashboard

🌍 **Live Demo:** [finance-dashboard-zorvyn-ketaki.vercel.app](finance-dashboard-zorvyn-ketaki.vercel.app)

A premium, high-fidelity responsive web application showcasing meticulous UI/UX design and modern front-end engineering, built specifically for exploring financial metrics, transactions, and real-time dashboard analytics.

## Tech Stack

*   **Vanilla JS (ES6+)**: Core logic and component lifecycle.
*   **Vite**: Next-generation frontend tooling for rapid development and optimized builds.
*   **Chart.js**: Responsive, interactive data visualization.
*   **Lucide-Icons**: Beautiful, consistent iconography.

## Core Features

*   **Reactive State Engine**: Custom implementation of a reactive data store using the native JavaScript `Proxy` API to automatically trigger targeted component re-renders on state mutation.
*   **Modular Component Architecture**: A highly scalable `BaseComponent` lifecycle pattern, keeping modular UI pieces isolated and maintainable without sacrificing performance.
*   **Role-Based Access Control (RBAC)**: Integrated simulation of Admin vs. Viewer permissions altering the available application features and controls seamlessly.
*   **Data Persistence**: Full `localStorage` integration ensures zero loss of user state, themes, or simulated interactions upon page refreshes.
*   **Mobile-First Design**: Fully responsive, CSS Grid/Flexbox powered workflows featuring slide-out mobile navigations, horizontally scrollable data tables, and dynamic mobile-optimized stack layouts.

## Technical Decisions & Trade-offs

Vanilla JS was chosen intentionally for this project to demonstrate a profound mastery of native DOM APIs, event delegation, and browser runtime behavior as requested in the Zorvyn JD. Instead of relying on the heavy abstractions and built-in reactivity loops of frameworks like React or Vue, this dashboard proves that dynamic, reactive interfaces, intricate state synchronization, and complex layout orchestration can be achieved natively. This approach yields a significantly smaller bundle size, faster initial execution, and a deeper understanding of web fundamentals, making architectural pivots robust and adaptable in a corporate setting.

## Setup Instructions

1.  **Install Dependencies**
    Ensure you have `Node.js` installed. Clone the repository and run:
    ```bash
    npm install
    ```

2.  **Run Development Server**
    Start the Vite lightning-fast dev server:
    ```bash
    npm run dev
    ```
    Open the provided `localhost` link in your browser to view the application.

## License

This project was built explicitly for the Zorvyn Internship Assignment.
