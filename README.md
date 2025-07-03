# TipJar

TipJar is a full-stack crowdfunding platform designed for creators. It enables fans and followers to support creative projects through monetary "tips," helping creators turn their passion projects into reality. Users can create profiles, showcase their work, and receive financial support from their community.

## Key Features

*   **User Authentication**: Secure sign-up and login functionality for creators and supporters.
*   **Creator Profiles**: Customizable public profiles where creators can share information about themselves, their work, and link to their projects.
*   **Project Management**: Creators can add, update, and delete projects, complete with titles, descriptions, and cover images.
*   **Dashboard**: An intuitive dashboard for creators to track their total income, view recent transactions, monitor follower counts, and manage their projects.
*   **Tipping System**: Supporters can send tips to their favorite creators. The system includes a simulated UPI payment flow.
*   **Follow System**: Users can follow creators to stay updated on their latest projects.
*   **Income Analytics**: A line chart on the dashboard visualizes the trend of tips received over time.
*   **Image Handling**: Utilizes EdgeStore for efficient image uploads for profile pictures and project covers.

## Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/)
*   **Frontend**: [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **Backend**: Next.js API Routes, [Node.js](https://nodejs.org/)
*   **Database**: [MongoDB](https://www.mongodb.com/)
*   **Image Storage**: [EdgeStore](https://edgestore.dev/)
*   **Authentication**: [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing and cookie-based session management.

## Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

*   Node.js (v18 or later)
*   npm, yarn, or pnpm
*   A running instance of MongoDB. The application is configured to connect to `mongodb://localhost:27017/` by default.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Abhijay-Singh67/TipJar.git
    cd TipJar
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Running the Application

1.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at [http://localhost:3000](http://localhost:3000).

2.  **Build for production:**
    To create a production-ready build, run:
    ```sh
    npm run build
    ```
    To start the production server, run:
    ```sh
    npm run start
    ```

## Important Security Note

The payment system implemented in this project is a proof-of-concept and is **not secure for real transactions**. It simulates a payment flow by asking users to manually enter a transaction ID. For a production environment, it is crucial to replace this with a secure payment gateway integration like Stripe, PayPal, or Razorpay.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for more details.
