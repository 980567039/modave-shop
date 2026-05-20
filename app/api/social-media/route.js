// 社交媒体集成
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
    const { code } = req.query;
    
    // Exchange authorization code for access token
    try {
      const response = await axios.post('https://api.instagram.com/oauth/access_token', {
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM__CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/api/auth/instagram', // Adjust redirect URI
        code,
      });
  
      const accessToken = response.data.access_token;
  
      // Store access token securely, e.g., in session storage
    //   req.session.accessToken = accessToken;
  
      // Redirect user to dashboard or another page
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error);
      res.status(500).json({ error: 'Failed to authenticate with Instagram' });
    }
  }