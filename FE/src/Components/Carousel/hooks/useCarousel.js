import { useState, useEffect, useLayoutEffect } from 'react';

const useCarousel = ({$CarouselAreaWrapper, $CarouselArea, itemLength, unit}) => {
  
  const [carouselNavigatorAreaSize, setCarouselNavigatorAreaSize] = useState({width: 0, height: 0});
  const [itemWidth, setItemWidth] = useState(0);
  const [calculatedMovableRange, setCalculatedMovableRange] = useState({from: 0, to: 0});
  const [slideCount, setSlideCount] = useState(unit);
  const [carouselEvent, setCarouselEvent] = useState({isActive:false, msg:""});

  useEffect(() => {
    $CarouselArea.current.classList.add("carousel-start")
    return () => { $CarouselArea.current.classList.remove("carousel-start"); }
  }, [slideCount]);

  useLayoutEffect(()=> {
    handleResize();
    // 향후 쓰로틀로 변경
    window.addEventListener("resize", handleResize);
    
    // cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth])
  
  const handleResize = () => {
    setCarouselNavigatorAreaSize({ 
      width: $CarouselAreaWrapper.current.clientWidth, 
      height: $CarouselAreaWrapper.current.clientHeight 
    });
    setItemWidth($CarouselAreaWrapper.current.clientWidth / unit);
  }

  const isNotAbleToSlide = ({type}) => {
    if (carouselEvent.isActive) return true;
    
    if (type === "left" && slideCount === unit) {
      setCarouselEvent({ isActive: true, msg: "처음입니다" });
      return true;
    } else if (type === "right" && slideCount === itemLength) {
      setCarouselEvent({ isActive: true, msg: "마지막입니다" });
      return true;
    }

    return false;
  }
  
  const slideLeft = () => {
    if (isNotAbleToSlide( {type: "left"} )) return false;
    
    let calculatedXValue = calculatedMovableRange.to;
    // let ItemWidth = $CarouselArea.current.offsetWidth/unit;
    if (slideCount - unit < unit) {
      let remainItemsCount = slideCount%unit;
      calculatedXValue += itemWidth*remainItemsCount;
      setSlideCount(unit);
    } else {
      calculatedXValue += $CarouselArea.current.offsetWidth;
      setSlideCount(slideCount - unit);
    }
    setCalculatedMovableRange({from: calculatedMovableRange.to, to: Number(calculatedXValue.toFixed(3))});
    return true;
  }

  const slideRight = () => {
    if (isNotAbleToSlide( {type: "right"} )) return false;

    let calculatedXValue = calculatedMovableRange.to;
    if (slideCount + unit > itemLength) {
      let remainItemsCount = itemLength - slideCount;
      calculatedXValue -= itemWidth*remainItemsCount;
      setSlideCount(itemLength);
    } else {
      calculatedXValue -= $CarouselArea.current.offsetWidth;
      setSlideCount(slideCount + unit);
      
    }
    setCalculatedMovableRange({from: calculatedMovableRange.to, to: Number(calculatedXValue.toFixed(3))});
    return true;
  }
  
  return {
    calculatedMovableRange, 
    itemWidth,
    useNavigator: () => { 
      return {slideLeft, slideRight, carouselNavigatorAreaSize, totalIndex: Math.ceil(itemLength/unit) }
    },
    useEventModal: () => {
      return {carouselEvent, setCarouselEvent}
    }
  }
}

export default useCarousel;