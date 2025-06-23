import {createStackNavigator} from '@react-navigation/stack';
import Search from '../../screens/Search';
import Home from '../../screens/Home';
import AlbumView from '../../screens/AlbumView';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {fonts} from '../../utils/fonts';
import HeaderIcons from '../../UI/header';
import {View,Image} from 'react-native';
import AntDesign from '@react-native-vector-icons/ant-design';
import Ionicons from '@react-native-vector-icons/ionicons';
import Library from '../../screens/Library';
import Play from '../Play';
import PlaylistView from '../../screens/PlaylistView';
import ArtistView from '../../screens/ArtistView';
import {getProfile} from '../../utils/http';
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import LikedItems from '../../screens/LikedItems';

const Stack = createStackNavigator();

const BottomTab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={Home}
        options={{
          headerTitle: 'Recently Played',
          headerStyle: {backgroundColor: '#111'},
          headerTintColor: 'white',
          headerTitleStyle: {fontFamily: fonts.bold},
          headerRight: ({tintColor}) => <HeaderIcons tintColor={tintColor} />,
        }}
      />
    </Stack.Navigator>
  );
}
function SearchStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchStack"
        component={Search}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
function LibraryStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LibraryStack"
        component={Library}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
export function BottomNavigation() {
  const [userName, setUserName] = useState('Your Library');
  const token = useSelector(state => state.auth.token);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getProfile(token);
        console.log(profile);

        if (profile?.display_name) {
          setUserName(profile.display_name + "'s Library");
        }
        if (profile?.images?.length > 0) {
          setUserImage(profile.images[0].url);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    }

    if (token) {
      fetchProfile();
    }
  }, [token]);

  return (
    <BottomTab.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#111111'},
        headerTintColor: 'white',
        tabBarBackground: () => (
          <View style={{backgroundColor: '#111111', flex: 1}} />
        ),
        tabBarActiveTintColor: 'white',
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          headerTitle: 'Recently Played',
          headerTitleStyle: {fontFamily: fonts.bold},
          headerShown: false,

          tabBarIcon: ({color, size}) => (
            <AntDesign name="home" color={color} size={size} />
          ),
          headerRight: ({tintColor}) => <HeaderIcons tintColor={tintColor} />,
        }}
      />

      <BottomTab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          headerTitle: 'Search',
          headerTitleStyle: {fontFamily: fonts.bold},
          tabBarIcon: ({color, size}) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Library"
        component={LibraryStackScreen}
        options={{
          headerTitle: userName,
          headerTitleStyle: {fontFamily: fonts.bold},
          headerLeft: () =>
            userImage ? (
              <Image
                source={{uri: userImage}}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginRight: 16,
                  marginLeft:16
                }}
              />
            ) : null,

          tabBarIcon: ({color, size}) => (
            <Ionicons name="library" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="AlbumView"
        component={AlbumView}
        options={{headerShown: false, tabBarItemStyle: {display: 'none'}}}
      />
      <BottomTab.Screen
        name="PlaylistView"
        component={PlaylistView}
        options={{headerShown: false, tabBarItemStyle: {display: 'none'}}}
      />
      <BottomTab.Screen
        name="ArtistView"
        component={ArtistView}
        options={{headerShown: false, tabBarItemStyle: {display: 'none'}}}
      />
      <BottomTab.Screen
        name="LikedSongs"
        component={LikedItems}
        options={{headerShown: false, tabBarItemStyle: {display: 'none'}}}
      />
    </BottomTab.Navigator>
  );
}
