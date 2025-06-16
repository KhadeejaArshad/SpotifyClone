import TrackPlayer from 'react-native-track-player';
import {setupPlayer} from './trackPlayer';

export async function playPreviewUrl(previewUrl,track) {
  if (!previewUrl) {
    console.warn('No preview URL available.');
    return;
  }

  try {
   
    const isSetup = await setupPlayer();


    if (!isSetup) {
      console.error('TrackPlayer setup failed');
      return;
    }

    await TrackPlayer.reset();
    await TrackPlayer.add([
      {
        id: track.id,
        url: previewUrl,
        title: track.name,
        artist:track?.artists?.map(artist => artist.name).join(', '),
      },
    ]);
    await TrackPlayer.play();
  } catch (error) {
    console.error('Error playing preview URL:', error);
  }
}
