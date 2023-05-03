// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    output: 'export',
    basePath: '/ecdsa-node',
    experimental: {
        appDir: true,
    },
}

module.exports = nextConfig