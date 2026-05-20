import { getServerSession } from "next-auth";
import { fetchUserChannelData, fetchUserChannelVideos } from '@/lib/youtube';
import { redirect } from 'next/navigation';
import { authOptions } from "@/lib/authOptions";
import { cookies, headers } from 'next/headers';
import Image from "next/image";

const ChannelPage = async ({}) => {

  const cookieStore = cookies();
  const headersList = headers();

  const req = {
    headers: Object.fromEntries(headersList.entries()),
    cookies: Object.fromEntries(cookieStore.getAll().map(cookie => [cookie.name, cookie.value])),
  };

  const res = {
    getHeader: () => null,
    setHeader: () => null,
  };

  const {user: session} = await getServerSession(req, res, authOptions);
  
  if (!session) {
    redirect('/integrations');
  }



  const channelData = await fetchUserChannelData(session.accessToken);
  const videos = await fetchUserChannelVideos(session.accessToken);

  if (!channelData) {
    return <div>Failed to load channel data</div>;
  }

  return (
    <div>
      <h1>{channelData.snippet.title}</h1>
      <p>{channelData.snippet.description}</p>
      <p>Subscribers: {channelData.statistics.subscriberCount}</p>
      <p>Views: {channelData.statistics.viewCount}</p>
      <p>Videos: {channelData.statistics.videoCount}</p>

      <h2>Latest Videos</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.id.videoId}>
            <h3>{video.snippet.title}</h3>
            <p>{video.snippet.description}</p>
            <Image src={video.snippet.thumbnails.default.url} alt={video.snippet.title} width={100} height={100}/>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelPage;
