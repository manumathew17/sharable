import React, {useEffect, useRef, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {EffectCards, EffectCoverflow, Navigation} from "swiper";
import VideoCardActive from "../VideoCardActive";
import {getBrandId, getSessionId, getUserAgent, getUserId} from "../../../utils/utils";
import {postEvent} from "../../../api";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

function VideoContainerModal({videos = [], selectedIndex = 0, closeModal, showProductDetails, openPip}) {
    const [currIndex, setCurrIndex] = useState(selectedIndex);
    const [currentData, setCurrentData] = useState({});
    const [swiper, setSwiper] = useState(null);
    const [isVideoMute, setIsVideoMute] = useState(true);
    const [canSwipe, setCanSwipe] = useState(true);
    const swiperRef = useRef(null);
    const [onTouch, setOnTouch] = useState("touch");



    const onToggleMute = () => {
        setIsVideoMute(!isVideoMute);
    };

    useEffect(() => {
        setCurrentData(videos[selectedIndex])
        setCurrIndex(selectedIndex)
    }, []);

    const handleActiveIndexChange = (index) => {
        setCurrentData(videos[index])
        setCurrIndex(index);
        const requestBody = {
            session_id: getSessionId(),
            user_id: getUserId(),
            company_id: getBrandId(),
            event: 'PLAY',
            shoppable_feed_id: videos[index]._id,
            user_agent: getUserAgent(),
        }
        try {
            postEvent(requestBody)
        } catch (e) {
        }

    };


    const handleSwipe = (value) => {
        setCanSwipe(!value)
        if (swiper) {
            swiper.allowTouchMove = !value;
        }
    }

    const onPipRequest = () => {
        openPip(currentData, currIndex)
        closeModal()
    }

    const scale = (progress) => {
        const scale = 1 - Math.min(Math.abs(progress * 0.2), 1);
        return `scale(${scale})`;
    };

    return (

        <Swiper
            effect={"coverflow"}
            grabCursor={false}
            centeredSlides={true}

            coverflowEffect={{
                rotate: 0,
                stretch: 200,
                depth: 200,
                modifier: 1,
                slideShadows: false,
            }}
            speed={200}
            autoplay={true}
            pagination={false}
            style={{width: '100%', height: '100%'}}
            modules={[EffectCoverflow, Navigation]}
            className="mySwipersaurav"
            onSwiper={setSwiper}
            simulateTouch={true}
            navigation={window.innerWidth > 900}
            initialSlide={selectedIndex}
            // onActiveIndexChange={handleActiveIndexChange}
            onSlideChange={(e) => handleActiveIndexChange(e.activeIndex)}
            slidesPerGroup={1}
            paginationAsGroup={false}
            // spaceBetween={window.innerWidth > 900 ? -100 : 0}
            freeMode={false}
            freeModeSticky={true}
            // onSlideChange={(e) => alert(e)}
            // slidesPerView="auto"
            breakpoints={{
                0: {
                    slidesPerView: 1,
                    direction: "vertical",
                    effect: "slide",
                    coverflowEffect: {
                        rotate: 0,
                        stretch: 0,
                        depth: 0,
                        modifier: 1,
                        slideShadows: false,
                    },
                },

                700: {
                    slidesPerView: 1,
                    direction: "vertical",
                    effect: "slide",
                    coverflowEffect: {
                        rotate: 0,
                        stretch: 0,
                        depth: 0,
                        modifier: 1,
                        slideShadows: false,
                    },
                },
                1100: {
                    slidesPerView: 3,
                    direction: "horizontal",
                    effect: "coverflow",
                },
            }}

            onTouchEnd={()=>{}}
        >
            {videos?.map((item, index) => (
                <SwiperSlide key={item._id}>
                    <VideoCardActive
                        videoData={item}
                        onClose={closeModal}
                        retrigger={() => {
                        }}
                        isActive={currIndex === index}
                        isLeftNeighbour={currIndex === index + 1}
                        isRightNeighbour={currIndex === index - 1}
                        onToggleMute={onToggleMute}
                        isVideoMute={currIndex === index && isVideoMute}
                        canSwipe={handleSwipe}
                        onPipRequest={onPipRequest}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default VideoContainerModal;
