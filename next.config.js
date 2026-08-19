/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Erlaubt Thumbnails von beliebigen Quellen (externe Bild-URLs + die eigene
    // PocketBase-Instanz). "http" zusätzlich zu "https", falls PocketBase lokal
    // oder auf einem VPS ohne SSL läuft — für Produktion empfiehlt sich, das auf
    // die eigene PocketBase-Domain einzuschränken.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  // Erlaubt die Web-Preview von Cloud-IDEs (z.B. Google Cloud Shell), die über eine
  // Proxy-Domain statt localhost laufen — sonst blockt Next.js künftig diese Requests.
  allowedDevOrigins: ["*.cloudshell.dev", "*.cs-europe-west1-haha.cloudshell.dev"],
};

module.exports = nextConfig;
