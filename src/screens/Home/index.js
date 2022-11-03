import React, { useState, useEffect} from 'react';
import { View, Dimensions, Image } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faHeart, faCommentDots, faPlay } from '@fortawesome/free-solid-svg-icons';

import BottomTabNavigator from '../../components/BottomTabNavigator';

import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import PagerView from 'react-native-pager-view';
import api from "../../Data/api.js"

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
    ContentLeftBottomDescription
} from './styles';

export default function Home({ navigation }) {

    const [paused, setPaused] = useState(false);
    const [feed, setfeed] = useState([]);

    useEffect(() => {
        async function LoadFeed() {
          try {
            const response = await api.get("/feed"); // ?_expand=author&_limit=5
            const data = await response.data;
           // console.log(data);
            setfeed(data);
           // console.log(feed);
          } catch (error) {
            console.log("Error get feed from server: " + error);
          }
        }
    
        LoadFeed();
      }, []);

    return (
        <View style={{ flex: 1 }}>
            {paused && <FontAwesomeIcon style={{ zIndex: 999, opacity: 0.8, position: 'absolute', alignSelf: 'center', top: '40%', bottom: '40%', left: '40%', right: '40%' }} icon={faPlay} size={100} color="#E5E5E5" />}
            <NewsByFollowing>
                <NewsByFollowingText>Following | <NewsByFollowingTextBold>For You</NewsByFollowingTextBold> </NewsByFollowingText>
            </NewsByFollowing>
            <PagerView style={{ flex: 1 }} orientation="vertical" initialPage={0}>
                {feed.map(feedImg => (                    
                    <View
                        key={feedImg._id}
                        style={{ flex: 1, height: Dimensions.get("window").height, backgroundColor: '#010101' }}>
                       <ImageZoom  source={{ uri: feedImg.url }} 
                       style= {{flex:1 , width: '100%', height: '100%', resizeMode: 'contain'}}
                    />
                        <ContentRight>
                            <ContentRightUser>
                                <ContentRightUserImage resizeMode="contain" source={{ uri: feedImg.user ? feedImg.user.avatarImgUrl : "https://p16-va-default.akamaized.net/img/musically-maliva-obj/1606484041765893~c5_720x720.jpeg" }} />
                            </ContentRightUser>
                            <ContentRightUserPlus>
                                <FontAwesomeIcon icon={faPlus} size={12} color="#FFF" />
                            </ContentRightUserPlus>
                            <ContentRightHeart>
                                <FontAwesomeIcon icon={faHeart} size={28} color="#FFF" />
                                <ContentRightText>{feedImg.countLikes > 1000 ? `${feedImg.countLikes}K` : feedImg.countLikes}</ContentRightText>
                            </ContentRightHeart>
                            <ContentRightComment>
                                <FontAwesomeIcon icon={faCommentDots} size={28} color="#FFF" />
                                <ContentRightText>{feedImg.countComments > 1000 ? `${feedImg.countComments}K` : feedImg.countLikes}</ContentRightText>
                            </ContentRightComment>
                        </ContentRight>
                        <ContentLeftBottom>
                            <ContentLeftBottomNameUser onPress={feedImg.user ? () => navigation.navigate("User", {
                                user: {
                                    image: feedImg.user.avatarImgUrl,
                                    name: feedImg.user.name,
                                    following: feedImg.user.following,
                                    followers: feedImg.user.followers,
                                    likes: feedImg.user.countLikes
                                }
                            }): () => 1}>
                                <ContentLeftBottomNameUserText numberOfLines={1}>{feedImg.user? feedImg.user.name : "Anonim"}</ContentLeftBottomNameUserText>
                            </ContentLeftBottomNameUser>
                            <ContentLeftBottomDescription numberOfLines={2}>{feedImg.description}</ContentLeftBottomDescription>
                        </ContentLeftBottom>
                    </View>
                ))}
                </PagerView> 
            <BottomTabNavigator background="transparent" colorIcon="#FFF" colorTitle="#FFF" navigation={navigation} />
        </View>
    )
}
