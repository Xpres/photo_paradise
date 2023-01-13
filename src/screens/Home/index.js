import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import {
  View,
  Dimensions,
  RefreshControl,
  Image,
  ScrollView,
} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlus,
  faHeart,
  faCommentDots,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

import BottomTabNavigator from "../../components/BottomTabNavigator";

import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import PagerView from "react-native-pager-view";
import * as SecureStore from "expo-secure-store";

import api from "../../Data/api.js";
import { AuthContext } from "../../context/AuthContext";
import { AxiosContext } from "../../context/AxiosContext";
import Toast from "react-native-root-toast";

import {
  styles,
  NewsByFollowing,
  NewsByFollowingText,
  NewsByFollowingTextBold,
  ContentRight,
  ContentRightUser,
  ContentRightUserImage,
  ContentRightUserPlus,
  ContentRightHeart,
  ContentRightComment,
  ContentRightText,
  ContentLeftBottom,
  ContentLeftBottomNameUser,
  ContentLeftBottomNameUserText,
  ContentLeftBottomDescription,
} from "./styles";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function Home({ navigation }) {
  const [paused, setPaused] = useState(false);
  const [feed, setfeed] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const skip = useRef(0);
  const { publicAxios, authAxios } = useContext(AxiosContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  async function LoadFeed() {
    try {
      const response = await authAxios.get(
        "api/feed?_limit=3&_skip=" + skip.current
      ); // ?_expand=author&_limit=5&_skip=15
      skip.current = skip.current + 3;
      const data = await response.data;
      setfeed(feed.concat(data));
      console.log(data);
    } catch (error) {
      console.log("Error get feed from server: " + error);
    }
  }

  const pageScrollHandler = (e) => {
    console.log(e.nativeEvent);
    if (
      !((e.nativeEvent.position + 1) % 3) &&
      e.nativeEvent.position + 1 >= feed.length
    ) {
      console.log(e.nativeEvent);
      LoadFeed();
    }
  };

  const authContext = useContext(AuthContext);
  const loadJWT = useCallback(async () => {
    try {
      const value = await SecureStore.getItemAsync("token");
      if (Object.is(value, null)) {
        throw Error("jwt not found on startup");
      }
      const jwt = await JSON.parse(value);
      console.log("SecureStore value:" + value);
      //update immediately and directly accessToken state, to overcome issue on first get feed on startup
      //otherwise it will get first feed as unauthenticated user, unwanted behavior
      //ToDo: is this correct, is this the best solution, do this conflict with something
      //do we even need a state hook for tokens, so far, don't see the use of it
      //possible just use a static array of global configuration storage.
      authContext.authState.accessToken = jwt?.accessToken || null;

      authContext.setAuthState({
        accessToken: jwt?.accessToken || null,
        refreshToken: jwt?.refreshToken || null,
        authenticated: jwt?.accessToken !== null,
      });
      console.log("jwt load ok on startup");
    } catch (error) {
      console.log("jwt not found on startup");
      console.log(`Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
    //trigger first feed load on startup
    LoadFeed();
  }, []);

  useEffect(() => {
    loadJWT();
  }, []);

  const onLike = async (img) => {
    let response;
    // 1 like img, 2 unlike, null means not liked before
    try {
      if (img.like == null || img.like == 2) {
        img.like = 1; // like
        img.countLikes++;
      } else if (img.like == 1) {
        //unlike
        img.like = 2;
        img.countLikes--;
      }
      response = await authAxios.post("/api/imgs/like", {
        id: img.id,
        like: img.like,
      });
      //ToDo see if response is positive, otherwise reset to previous state
      // reset to previous state in catch, I guess, like instagram does.

      Toast.show("Request:" + response.data.message, {
        duration: Toast.durations.SHORT,
      });
      console.log("response: " + response.data);
    } catch (error) {
      if (error.response) {
        Toast.show("Login Failed", error.response.data); // => the response payload
      } else Toast.show("Login Failed");
      console.log("error: " + error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {paused && (
        <FontAwesomeIcon
          style={{
            zIndex: 999,
            opacity: 0.8,
            position: "absolute",
            alignSelf: "center",
            top: "40%",
            bottom: "40%",
            left: "40%",
            right: "40%",
          }}
          icon={faPlay}
          size={100}
          color="#E5E5E5"
        />
      )}
      <NewsByFollowing>
        <NewsByFollowingText>
          Following | <NewsByFollowingTextBold>For You</NewsByFollowingTextBold>{" "}
        </NewsByFollowingText>
      </NewsByFollowing>

      <PagerView
        style={{ flex: 1 }}
        orientation="vertical"
        initialPage={0}
        offscreenPageLimit={1}
        onPageScroll={pageScrollHandler}
      >
        {feed.map((feedImg) => (
          <View
            key={feedImg.id}
            style={{
              flex: 1,
              height: Dimensions.get("window").height,
              backgroundColor: "#010101",
            }}
          >
            <ImageZoom
              source={{ uri: feedImg.url }}
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
            />
            <ContentRight>
              <ContentRightUser>
                <ContentRightUserImage
                  resizeMode="contain"
                  source={{
                    uri: feedImg.user
                      ? feedImg.user.avatarImgUrl
                      : "https://p16-va-default.akamaized.net/img/musically-maliva-obj/1606484041765893~c5_720x720.jpeg",
                  }}
                />
              </ContentRightUser>
              <ContentRightUserPlus>
                <FontAwesomeIcon icon={faPlus} size={12} color="#FFF" />
              </ContentRightUserPlus>
              <ContentRightHeart
                onPress={() => {
                  if (authContext?.authState?.authenticated === false) {
                    navigation.navigate("Login");
                  } else {
                    onLike(feedImg);
                    //let updatedFeeds = feed.filter( feed => feed.id != feedId )
                    let updatedFeeds = Array.from(feed);
                    setfeed(updatedFeeds); // you were setting it to the old unchanged feeds variable
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  size={28}
                  color={feedImg.like == 1 ? "red" : "#FFF"}
                />
                <ContentRightText>
                  {feedImg.countLikes > 1000
                    ? `${feedImg.countLikes}K`
                    : feedImg.countLikes}
                </ContentRightText>
              </ContentRightHeart>
              <ContentRightComment>
                <FontAwesomeIcon icon={faCommentDots} size={28} color="#FFF" />
                <ContentRightText>
                  {feedImg.countComments > 1000
                    ? `${feedImg.countComments}K`
                    : feedImg.countComments}
                </ContentRightText>
              </ContentRightComment>
            </ContentRight>
            <ContentLeftBottom>
              <ContentLeftBottomNameUser
                onPress={
                  feedImg.user
                    ? () =>
                        navigation.navigate("User", {
                          user: {
                            image: feedImg.user.avatarImgUrl,
                            name: feedImg.user.name,
                            following: feedImg.user.following,
                            followers: feedImg.user.followers,
                            likes: feedImg.user.countLikes,
                          },
                        })
                    : () => 1
                }
              >
                <ContentLeftBottomNameUserText numberOfLines={1}>
                  {feedImg.user ? feedImg.user.name : "Anonym"}
                </ContentLeftBottomNameUserText>
              </ContentLeftBottomNameUser>
              <ContentLeftBottomDescription numberOfLines={2}>
                {feedImg.description}
              </ContentLeftBottomDescription>
            </ContentLeftBottom>
          </View>
        ))}
      </PagerView>
      <BottomTabNavigator
        background="transparent"
        colorIcon="#FFF"
        colorTitle="#FFF"
        navigation={navigation}
      />
    </View>
  );
}
