# Template: SolidJS + Elysia

Template for [SolidJS](https://www.solidjs.com/) SPA with [Elysia](https://elysiajs.com/at-glance.html) BFF (Backend-for-Frontend) layer. Elysia was chosen because it is performant, uses TypeScript thus creating language symmetry on both ends of the stack and, provides end-to-end type safety between the server (BFF) and the client (SPA) via [Eden Treaty](https://elysiajs.com/eden/treaty/overview.html). Furthermore, Elysia has a healthy and growing plugin ecosystem that provides first-party support for popular tools like [Swagger](https://elysiajs.com/plugins/swagger.html) for API documentation and [OpenTelemetry](https://elysiajs.com/plugins/opentelemetry.html) that provides observability, metrics and tracing to identify bottlenecks and general server performance which are important when productionizing applications.

With all of the above said, this additional BFF layer serves the following purposes:

- It is the primary source of data for the SolidJS frontend (`/api`). It will do the work of interfacing with external data sources for the sake of the frontend.
- It is responsible for serving the production built frontend assets generated from `bun run build`.
- Building on first point, issues related to CORS are gone as the frontend and backend BFF share the same origin URL.
- Can enrich or massage data for the frontend if/when desired.

Other things configured include:

- TypeScript (for both SPA and BFF)
- [Solid Query](https://tanstack.com/query/latest/docs/framework/solid/overview#motivation) (for data fetching / caching against BFF layer)
- [MSW](https://mswjs.io/docs/getting-started) + [Solid Testing Library](https://github.com/solidjs/solid-testing-library) + Vitest (for SPA testing)
- Bun Test (for BFF testing)
- ESLint / Prettier
- Dockerfile (for containerized deployments)
- GitHub Actions
  - `ci.yaml`: Workflow for running code quality checks (linting, formatting, typechecks, tests).
  - `sandbox.yaml`: Workflow for building and pushing ephemeral deployments on every pull request to `main`. (_Developer Note: make sure to create a separate cleanup sandbox workflow that tears down the ephemeral deployment once the pull request has been merged to `main`_)
  - `deploy.yaml`: Workflow for building and pushing deployments on merge to `main`. Has a manual `workflow_dispatch` configured to support manual pushes as well. You can imagine the workflow being set where, on every merge to `main` you continuously deploy your app to some `qa` or `staging` environment. When you are satisfied with the changes, you can then manually trigger the workflow to push either the latest in `main` or git hash to your production environment.
  - _Developer Notes: For the `sandbox.yaml` and `deploy.yaml` workflows, there are placeholder jobs that store the production image artifacts of the application. It is expected that when using this template, you remove those placeholder jobs and update the workflows to reflect your deployment use-case (e.g. push images to an image repository of some kind followed by deploying the image to Kubernetes or elsewhere)._

### Comments

Ideally, we would use `bun` for everything (frontend + backend) but there are gaps, specifically for the frontend, in the following two areas which force us to use Vite + Vitest: **bundling** and **testing**.

On the bundling side, Bun does not support bundling `index.html` nor injecting any bundled JS asset into the `index.html` file. We can probably work around this via doing some manual scripting but that is not worth doing for what is already a solved problem using other tools.

This is why we use Vite for bundling the frontend as there is the official `vite-plugin-solid` which does all the work under the hood for helping Vite to work with Solid. Furthermore, that same Vite plugin is what helps us to write tests against the SolidJS frontend using Vitest.

On the day when Bun provides an official plugin for Solid where it can bundle the web app and allow for writing tests against it, we can then deprecate Vite/Vitest and rely on Bun as the primary toolchain for the entire repository.

## Getting Started

Some pre-requisites before install dependencies:

- Install Node Version Manager (NVM)
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  ```
- Install Bun
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

### Installing Dependencies

```bash
nvm use
bun install
```

### Local Development Build

```bash
# Note: UI dev server running on port 3000 proxies API requests to port 8000
bun start                   # http://localhost:3000
bun start:server --watch    # http://localhost:8000

bun start:msw               # start UI with mock server
```

### Local Production Build

```bash
bun run build         # Build production frontend static assets
bun start:server      # Backend serves assets at http://localhost:8000

docker-compose up -d  # Or alternatively using docker-compose
```

### Linting & Formatting

```bash
bun lint    # checks source for lint violations
bun format  # checks source for format violations

bun lint:fix    # fixes lint violations
bun format:fix  # fixes format violations
```

### Unit Testing

> We use [Solid Testing Library](https://github.com/solidjs/solid-testing-library) for integration style unit tests

```bash
bun test:ui
bun test:server             # or `bun test`

bun test:ui --coverage      # with test coverage
bun test:server --coverage  # with test coverage
```

### Docker / Podman Image

The provided `Dockerfile` includes all the things needed to build the SPA and BFF to support a containerized deployment model.
Recommended to use `podman` as it is daemon-less and does not require root privileges which offers better security, especially in shared environments.

```bash
# Using Podman (recommended)
podman build -t [tag_name] .

# Using Docker
docker build -t [tag_name] .
```

### Contributing

The only requirements when contributing are:

- You keep a clean git history in your branch
  - rebasing `main` instead of making merge commits.
- Using proper commit message formats that adhere to [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
  - Additionally, squashing (via rebase) commits that are not [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- CI checks pass before merging into `main`
