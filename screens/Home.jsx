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

function Home() {
  const id = useSelector(state => state.player.currentTrack);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    async function setup() {
      const isSetup = await setupPlayer();

      setIsPlayerReady(isSetup);
    }
    setup();
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.root}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView>
        <Recents />
        <Wrap />

        <Editors />
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
});
