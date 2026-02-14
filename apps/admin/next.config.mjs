/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@workspace/db",
    "@workspace/auth",
    "@workspace/api",
    "@workspace/schema",
    "@workspace/utils",
  ],
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
