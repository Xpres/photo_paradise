import React, { useState } from 'react';
import { View, ScrollView, Dimensions, Image } from 'react-native';

import Video from 'react-native-video';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faHeart, faCommentDots, faPlay } from '@fortawesome/free-solid-svg-icons';

import BottomTabNavigator from '../../components/BottomTabNavigator';

import videos from '../../Data/Videos/videos';

import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import PagerView from 'react-native-pager-view';

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
    ContentRightWhatsApp,
    ContentRightWhatsAppImage,
    ContentRightText,
    ContentLeftBottom,
    ContentLeftBottomNameUser,
    ContentLeftBottomNameUserText,
    ContentLeftBottomDescription,
    ContentLeftBottomMusic
} from './styles';

export default function Home({ navigation }) {

    const [paused, setPaused] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            {paused && <FontAwesomeIcon style={{ zIndex: 999, opacity: 0.8, position: 'absolute', alignSelf: 'center', top: '40%', bottom: '40%', left: '40%', right: '40%' }} icon={faPlay} size={100} color="#E5E5E5" />}
            <NewsByFollowing>
                <NewsByFollowingText>Following | <NewsByFollowingTextBold>For You</NewsByFollowingTextBold> </NewsByFollowingText>
            </NewsByFollowing>
            <PagerView style={{ flex: 1 }} orientation="vertical" initialPage={0}>
                {videos.map(video => (                    
                    <View
                        key={video.id}
                        style={{ flex: 1, height: Dimensions.get("window").height, backgroundColor: '#010101' }}>
                       <ImageZoom  source={{ uri: video.user.image }} 
                       style= {{flex:1 , width: '100%', height: '100%', resizeMode: 'contain'}}
                    />
                        <ContentRight>
                            <ContentRightUser>
                                <ContentRightUserImage resizeMode="contain" source={{ uri: video.user.image }} />
                            </ContentRightUser>
                            <ContentRightUserPlus>
                                <FontAwesomeIcon icon={faPlus} size={12} color="#FFF" />
                            </ContentRightUserPlus>
                            <ContentRightHeart>
                                <FontAwesomeIcon icon={faHeart} size={28} color="#FFF" />
                                <ContentRightText>{video.countLikes > 1000 ? `${video.countLikes}K` : video.countLikes}</ContentRightText>
                            </ContentRightHeart>
                            <ContentRightComment>
                                <FontAwesomeIcon icon={faCommentDots} size={28} color="#FFF" />
                                <ContentRightText>{video.countComments > 1000 ? `${video.countComments}K` : video.countLikes}</ContentRightText>
                            </ContentRightComment>
                            <ContentRightWhatsApp>
                                <ContentRightWhatsAppImage source={{ uri: "https://imagepng.org/wp-content/uploads/2017/08/WhatsApp-icone.png" }} />
                                <ContentRightText>{video.countWhatsApp > 1000 ? `${video.countWhatsApp}K` : video.countLikes}</ContentRightText>
                            </ContentRightWhatsApp>
                        </ContentRight>
                        <ContentLeftBottom>
                            <ContentLeftBottomNameUser onPress={() => navigation.navigate("User", {
                                user: {
                                    image: video.user.image,
                                    name: video.user.name,
                                    following: video.user.following,
                                    followers: video.user.followers,
                                    likes: video.user.likes
                                }
                            })}>
                                <ContentLeftBottomNameUserText numberOfLines={1}>{video.user.name}</ContentLeftBottomNameUserText>
                            </ContentLeftBottomNameUser>
                            <ContentLeftBottomDescription numberOfLines={3}>{video.description}</ContentLeftBottomDescription>
                            <ContentLeftBottomMusic numberOfLines={1}>{video.music}</ContentLeftBottomMusic>
                        </ContentLeftBottom>
                    </View>
                ))}
                </PagerView> 
            <BottomTabNavigator background="transparent" colorIcon="#FFF" colorTitle="#FFF" navigation={navigation} />
        </View>
    )
}
