// lib/youtube.js
import axios from 'axios';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchUserChannelData = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/channels`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        mine: true,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching YouTube channel data:', error);
    return null;
  }
};

export const fetchUserChannelVideos = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        forMine: true,
        maxResults: 10,
        order: 'date',
        type: 'video',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    // console.error('Error fetching YouTube channel videos:', error);
    return [];
  }
};
