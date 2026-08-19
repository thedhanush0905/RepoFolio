# Engineering Decisions - REPOfolio

### 1. Why this ingestion strategy over the obvious alternative you rejected?

- **Implemented Ingestion Approach**: The repository generation pipeline (`/api/github/repository`) builds Next.js portfolio websites by generating individual files (e.g., `package.json`, layout, components, global styles) in memory and committing them directly to the user's GitHub repository. It does this by making sequential HTTP `PUT` requests to the GitHub Contents API (`/repos/{owner}/{repo}/contents/{path}`). If the repository already exists, it checks for a `.repofolio` marker file and fetches existing file SHAs to perform update commits.
- **Obvious Alternative Rejected**: A local Git clone and push strategy. This alternative would involve cloning a base template repository to the server's local file system, modifying files locally, creating a single commit, and executing `git push` via shell command execution or a library like isomorphic-git.
- **Why Implemented Approach Was Chosen**: The application is designed to be serverless-first, running on Vercel Serverless Functions. Serverless environments have ephemeral, read-only local storage (except for `/tmp`) and lack the native Git CLI binary. Using the GitHub Contents API directly avoids writing files to disk, is completely state-free, and bypasses local filesystem overhead.

### 2. One trade-off you made under the time limit, and what you'd do with a real week

- **Trade-off Made**: The generation pipeline makes sequential, synchronous API calls for each file pushed (10+ separate PUT requests). If one of these calls fails (due to network timeout, API rate limit, or Vercel's hobby-tier serverless timeout), the repository is left in a broken, partially generated state. Additionally, this creates a noisy Git log with separate commits for each file ("Add README.md", "Add package.json", etc.).
- **Weekly Improvement Plan**: I would transition the pipeline to use the **GitHub Git Database API** to create a single, atomic commit:
  1. Post all generated files in parallel to the GitHub Blobs API (`POST /repos/{owner}/{repo}/git/blobs`) to obtain their SHAs.
  2. Retrieve the latest commit SHA of the main branch.
  3. Create a single tree object referencing these blobs (`POST /repos/{owner}/{repo}/git/trees`).
  4. Create a single commit pointing to the new tree and parent commit (`POST /repos/{owner}/{repo}/git/commits`).
  5. Update the branch reference (`PATCH /repos/{owner}/{repo}/git/refs/heads/main`).
  This ensures that repository updates are atomic (all-or-nothing), reduces total HTTP roundtrips from 10+ to 4, and cleans up the Git commit history into a single cohesive commit.

### 3. Where did you use AI tools, and what did you personally verify or change afterward?

- **AI Assistance Used**:
  - Refactoring the inline portfolio card layout in the dashboard into a reusable `<PortfolioCard>` component.
  - Generating layout boilerplate for the homepage "Saved Drafts" section and mobile responsive profile dropdown menu.
  - Identifying the Next.js `cookies()` async API pattern from `next/headers` to prevent Vercel's edge router from stripping custom headers during 307 redirect responses.
- **Personal Verification and Actions**:
  - **DNS Resolution Mismatch**: Diagnosed and resolved a c-ares DNS resolver regression on Node 22.x on Windows by updating the local MongoDB connection string format to direct replica member resolution.
  - **Vercel Mismatch**: Fixed a copy-paste error where `GOOGLE_REDIRECT_URI` on Vercel contained the variable name prefix (`GOOGLE_REDIRECT_URI=...`) instead of the URL string.
  - **Security Configurations**: Manually whitelisted Vercel serverless access (`0.0.0.0/0`) in MongoDB Atlas and updated the authorized redirect URIs in the Google Cloud Console credentials.
  - **Aesthetics & Validation**: Inspected local and production layouts to ensure the Google user avatar loads cleanly without CORS/referrer policy errors.
