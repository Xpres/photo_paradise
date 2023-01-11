import React, { useState, useEffect, useRef } from "react";
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
import api from "../../Data/api.js";

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  async function LoadFeed() {
    try {
      const response = await api.get("/feed?_limit=3&_skip=" + skip.current); // ?_expand=author&_limit=5&_skip=15
      skip.current = skip.current + 3;
      const data = await response.data;
      setfeed(feed.concat(data));
      console.log(feed);
    } catch (error) {
      console.log("Error get feed from server: " + error);
    }
  }

  useEffect(() => {
    LoadFeed();
  }, []);

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
                  feedImg.countLikes++;
                  console.log(`couts like: ${feedImg.countLikes}`);
                  navigation.navigate("Login");
                }}
              >
                <FontAwesomeIcon icon={faHeart} size={28} color="#FFF" />
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
                  {feedImg.user ? feedImg.user.name : "Anonim"}
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
