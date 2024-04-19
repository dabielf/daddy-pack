#### Starter with **NextJS**, **Convex**, TailwindCss, ShadCN and **Stripe**

## Getting Started

First, run the development server:

```bash
bun dev
```

In another terminal, run the convex dev server:

```bash
bunx convex dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Stack

- [Next.js](https://nextjs.org/docs) - as base framework
- [Convex](https://www.convex.dev/) - as BaaS
- [Clerk](https://clerk.com/) - for authentication management
- [Tailwind CSS](https://tailwindcss.com/) - for styling
- [shadcn/ui](https://ui.shadcn.com/) - for ui components
- [Stripe](https://stripe.com/) - for payment management

## More ressources

- [Integrate Convex with Clerk](https://docs.convex.dev/auth/clerk)
- [Integrate Stripe payments - Youtube video, starts at 29:40 ](https://www.youtube.com/watch?v=bTY0fa8p8D0)

## Todos

- [ ] Doc: Be more explicit about the setup steps
- [ ] Doc: What's included in the starter kit
- [ ] Dev: Auth with Clerk Api instead of components - [Documentation](https://clerk.com/docs/custom-flows/overview)
- [ ] Dev: Create user at but (instead of buy being enabled only if user is logged in)
- [ ] Dev: Create HomePage base and routing to the authenticated app
- [ ] Dev: Create user settings page
- [ ] Dev: Create consistent and opinionated styling
- [ ] Dev: Create useful components
