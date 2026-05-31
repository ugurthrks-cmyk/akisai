# AkışAI

**AkışAI** is an open-source Turkish AI tools directory, discovery platform, and educational resource built to help Turkish-speaking users discover, compare, and better understand AI products.

The project focuses on making AI knowledge more accessible for developers, creators, students, entrepreneurs, small businesses, and everyday users who want to explore practical AI tools in their own language.

Website: https://akisai.com.tr

---

## Why AkışAI Exists

Most AI product directories, comparison platforms, and technical resources are designed primarily for English-speaking audiences. This creates a knowledge gap for Turkish-speaking users who want to understand:

* Which AI tools are useful for their needs
* How different AI products compare
* What each tool does in plain language
* Which tools are relevant for content creation, coding, design, productivity, education, automation, and business workflows
* How to safely and effectively use AI in daily work

AkışAI aims to reduce that gap by providing a localized, structured, and accessible AI discovery experience.

---

## Project Goals

AkışAI is being developed with the following goals:

* Build a Turkish-first AI tools directory
* Help users discover and compare AI products more easily
* Provide clear explanations of AI tools and use cases
* Improve AI literacy for Turkish-speaking communities
* Create a maintainable open-source reference project for localized AI directories
* Support future AI-assisted workflows such as tool summarization, semantic search, comparison generation, and content quality review

---

## Features

Current and planned features include:

* AI tool listings
* Category-based tool discovery
* Turkish explanations for AI products
* Editorial pages and educational content
* Tool comparison structure
* SEO-friendly content architecture
* CMS-powered content management
* Responsive frontend design
* Scalable content model for future expansion

---

## Tech Stack

AkışAI is built with modern web technologies:

* **Next.js** — React framework for the frontend
* **TypeScript** — Type-safe development
* **Sanity CMS** — Structured content management
* **MDX** — Content-rich pages and documentation
* **CSS / Tailwind-compatible styling** — Responsive UI structure
* **Vercel-compatible deployment** — Fast and scalable hosting workflow

---

## Repository Structure

```bash
akisai/
├── public/              # Static assets
├── scripts/             # Utility scripts
├── src/                 # Application source code
├── sanity.config.ts     # Sanity CMS configuration
├── sanity.cli.ts        # Sanity CLI configuration
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project scripts and dependencies
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/ugurthrks-cmyk/akisai.git
cd akisai
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local development URL:

```bash
http://localhost:3000
```

---

## Environment Variables

This project may require environment variables for CMS and deployment configuration.

Create a `.env.local` file in the root directory and add the required variables based on your Sanity and deployment setup.

Example:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

Do not commit secret keys or private API tokens to the repository.

---

## Planned AI-Assisted Workflows

AkışAI is designed to benefit from AI-assisted development and editorial workflows, including:

* Generating structured summaries for AI tools
* Creating Turkish explanations for technical products
* Improving internal search relevance
* Producing comparison data between similar tools
* Reviewing content quality and consistency
* Helping maintain metadata and SEO structure
* Supporting automated issue and pull request review
* Detecting potential security or code quality issues

These workflows are intended to improve maintainability while keeping the final editorial experience useful, accurate, and human-reviewed.

---

## Roadmap

Planned improvements include:

* More AI tool categories
* Advanced filtering and search
* Tool comparison pages
* User-friendly AI guides in Turkish
* Better metadata and structured data
* Contributor documentation
* Automated content review workflows
* Improved accessibility and performance
* Public contribution guidelines
* Security review and dependency hardening

---

## Contributing

Contributions are welcome.

You can contribute by:

* Suggesting new AI tools
* Improving Turkish explanations
* Fixing bugs
* Improving UI components
* Enhancing performance
* Adding documentation
* Reporting issues
* Suggesting new categories or comparison formats

Before submitting a pull request, please open an issue or describe the change clearly so it can be reviewed properly.

---

## Development Guidelines

When contributing, please try to follow these principles:

* Keep the interface simple and accessible
* Write clear and maintainable TypeScript
* Avoid unnecessary complexity
* Prefer readable content structures
* Do not add unverified product claims
* Keep Turkish explanations clear and beginner-friendly
* Review AI-generated content before publishing
* Avoid committing secrets, private tokens, or API keys

---

## Security

If you discover a security issue, please do not publicly disclose sensitive details in an issue.

Instead, contact the maintainer privately or open a minimal report describing the affected area without exposing secrets or exploit details.

---

## Open Source Purpose

AkışAI is not only a website project. It is also an open-source attempt to make AI discovery more accessible for a local language community.

The project can serve as a reference for:

* Localized AI product directories
* Turkish AI education platforms
* CMS-powered content websites
* AI-assisted editorial workflows
* SEO-friendly knowledge platforms
* Open-source projects focused on AI literacy

---

## License

A license has not been finalized yet.

If you plan to reuse or redistribute this project, please contact the maintainer first. A formal open-source license may be added in a future release.

---

## Maintainer

Maintained by the AkışAI project team.

GitHub: https://github.com/ugurthrks-cmyk/akisai

Website: https://akisai.com.tr
