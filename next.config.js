/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cu7oipw2ltgu7rmy.public.blob.vercel-storage.com',
                port: '',
                pathname: '**',
            }
        ],
    },
}

module.exports = nextConfig
