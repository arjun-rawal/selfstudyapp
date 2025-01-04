/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    OPENAI_KEY: process.env.OPENAI_KEY,
    MONGO_URI: process.env.MONGO_URI,
  }
}

module.exports = nextConfig

