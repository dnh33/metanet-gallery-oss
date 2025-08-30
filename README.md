# Metanet Gallery OSS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/discord/YOUR_DISCORD_INVITE_CODE?label=Join%20Community&logo=discord)](https://discord.gg/YOUR_DISCORD_INVITE_CODE)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_GITHUB_USERNAME/metanet-gallery-oss)](https://github.com/YOUR_GITHUB_USERNAME/metanet-gallery-oss/issues)

**A self-hostable, open-source 3D gallery designed for Bitcoiners to showcase and explore Ordinal art and inscriptions.**

---

## About The Project

Metanet Gallery is born from the conviction that digital artifacts on the Bitcoin blockchain deserve a presentation layer that is as decentralized, sovereign, and enduring as the assets themselves. This project provides the tools for collectors, artists, and communities to create and self-host immersive 3D galleries, ensuring that the curation and ownership of the user experience remain firmly in the hands of the users.

Our mission is to build a robust, extensible platform that not only serves as a personal showcase but also as a foundational piece of infrastructure for the burgeoning Ordinals ecosystem. By empowering users to host their own galleries, we contribute to a more resilient and decentralized web.

## Features

- **Self-Hosted First:** Run your own gallery on your own terms. No central servers, no gatekeepers.
- **Immersive 3D Experience:** Built with Three.js to provide a dynamic and engaging way to view digital artifacts.
- **Supabase Integration:** Leverages Supabase for powerful and easy-to-manage user authentication, database, and storage.
- **Built with Astro:** A modern, performant web framework for building content-driven websites.
- **Open Source:** A community-driven project with a commitment to transparency and collaboration.

## Tech Stack

- [Astro](https://astro.build/) - The web framework for content-driven websites.
- [React](https://react.dev/) - UI components.
- [Three.js](https://threejs.org/) - 3D graphics library.
- [Supabase](https://supabase.io/) - Open source Firebase alternative for backend services.
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript for robust code.

## Development Guidelines

### Cursor IDE Configuration

This project includes specialized guidelines for developers using [Cursor IDE](https://cursor.sh/), an AI-powered code editor. The `.cursor/rules.md` file contains comprehensive development standards and best practices specifically tailored for this project.

#### Key Benefits for Cursor Users:

- **AI Agent Guidelines**: Detailed instructions for AI assistants working on Three.js and React development
- **Technical Standards**: Specific requirements for 3D gallery implementation, collision detection, and immersive experiences
- **Code Quality Standards**: TypeScript usage, error handling, and performance optimization guidelines
- **Platform Focus**: Clear boundaries ensuring all development serves the Metanet Gallery mission
- **Integration Standards**: Best practices for Ordinals API and Supabase integration

#### For Cursor Developers:

1. **Automatic Context**: Cursor automatically reads these rules to understand project requirements
2. **Consistent Development**: Ensures all contributions follow established patterns and standards
3. **Quality Assurance**: Built-in guidelines prevent common issues and maintain code quality
4. **Mission Alignment**: Keeps development focused on the core gallery platform objectives

The rules file serves as both documentation and an active development guide, helping maintain consistency across all contributions to the Metanet Gallery project.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/YOUR_GITHUB_USERNAME/metanet-gallery-oss.git
    cd metanet-gallery-oss
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

3.  **Set up Supabase:**
    - Initialize Supabase services:
      ```sh
      supabase init
      ```
    - Start the local Supabase stack:
      ```sh
      supabase start
      ```
    - The output will provide you with local Supabase credentials (`API URL`, `anon key`, `database URL`, etc.).

4.  **Configure Environment Variables:**
    - Create a `.env` file in the root of the project by copying the example:
      ```sh
      cp .env.example .env
      ```
    - Populate `.env` with the credentials from the `supabase start` command. It should look something like this:
      ```
      PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
      PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
      # ... and other variables
      ```

5.  **Run the development server:**
    ```sh
    pnpm dev
    ```

You should now be able to access the application at `http://localhost:3000`.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
