import React, { useEffect } from 'react';

export default function DiscordCallback() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(res => res.json())
        .then(data => {
          if (window.opener) {
            window.opener.postMessage({ type: 'DISCORD_AUTH_SUCCESS', profile: data }, '*');
            window.close();
          }
        })
        .catch(err => {
          console.error(err);
          if (window.opener) {
            window.opener.postMessage({ type: 'DISCORD_AUTH_ERROR' }, '*');
            window.close();
          }
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#004225] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Authenticating with Discord...</p>
      </div>
    </div>
  );
}
