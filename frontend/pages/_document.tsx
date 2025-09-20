import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Tailwind CSS CDN - blocking load to prevent FOUC */}
        <script src="https://cdn.tailwindcss.com?blocking=true"></script>
        
        {/* Tailwind Custom Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('DOMContentLoaded', function() {
                if (typeof tailwind !== 'undefined') {
                  tailwind.config = { 
                    theme: { 
                      extend: { 
                        colors: { 
                          'primary': '#F55F55', 
                          'accent': '#387ADF', 
                          'light': '#F7F9FC', 
                          'dark': '#2D3748', 
                          'medium': '#4A5568' 
                        } 
                      } 
                    } 
                  }
                }
              });
            `,
          }}
        />
        
        {/* CSS Variables for custom colors */}
        <style>
          {`
            :root {
              --tw-primary: #F55F55;
              --tw-accent: #387ADF; 
              --tw-light: #F7F9FC;
              --tw-dark: #2D3748;
              --tw-medium: #4A5568;
            }
          `}
        </style>
        
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" 
        />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CK1GR2RSRB"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CK1GR2RSRB');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
