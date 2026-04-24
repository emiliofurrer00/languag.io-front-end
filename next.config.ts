import type { NextConfig } from 'next';

const profileImageCdnBaseUrl =
  process.env.NEXT_PUBLIC_PROFILE_IMAGE_CDN_BASE_URL ?? process.env.PROFILE_IMAGE_CDN_BASE_URL;

const profileImageRemotePattern = profileImageCdnBaseUrl
  ? (() => {
      try {
        const url = new URL(profileImageCdnBaseUrl);

        return {
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
          hostname: url.hostname,
          port: url.port,
          pathname: '/**',
        };
      } catch {
        return null;
      }
    })()
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      ...(profileImageRemotePattern ? [profileImageRemotePattern] : []),
    ],
  },
  /* config options here */
};

export default nextConfig;
