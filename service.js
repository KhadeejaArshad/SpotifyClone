import TrackPlayer,{Event} from 'react-native-track-player';


module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
  TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());
  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, event => {
    console.log('Event.PlaybackTrackChanged', event);
  });

 TrackPlayer.addEventListener(Event.PlaybackState, event => {
  console.log('Event.PlaybackState', event);
});
TrackPlayer.addEventListener(Event.PlaybackQueueEnded,event =>{
  console.log('Queue Ended',event);
  
})
};