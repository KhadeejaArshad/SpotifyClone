import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';
import Recents from '../components/Recents';
import Editors from '../components/Editors';
import Wrap from '../components/Wrap';
import Play from '../components/Play';
import {useEffect, useState} from 'react';
import {setupPlayer} from '../utils/trackPlayer';
import { fetchTrack } from '../utils/http';
 import { fetchRecentlyPlayedAlbums,fetchRecentlyPlayedArtists } from '../utils/http';

function Home() {
  const id = useSelector(state => state.player.currentTrack);
  const token = useSelector(state => state.auth.token);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [recents, setRecents] = useState([]);
  const [wraps, setWraps] = useState([]);
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer();
      setIsPlayerReady(isSetup);
    }
    setup();
  }, []);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [recentData, wrapData, editorData] = await Promise.all([
          fetchRecentlyPlayedArtists(token),
          fetchRecentlyPlayedAlbums(token),
          fetchTrack(token),
        ]);
        setRecents(recentData);
        setWraps(wrapData);
        setEditors(editorData);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchAll();
  }, [token]);

  if (!isPlayerReady || loading) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.emptyState}>
        <ActivityIndicator size="large" color="#1DB954" />
      </SafeAreaView>

      </View>
      
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView>
        <Recents data={recents} />
        <Wrap data={wraps} />
        <Editors data={editors} />
      </ScrollView>
      {id && <Play />}
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111111',
  },
   emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
