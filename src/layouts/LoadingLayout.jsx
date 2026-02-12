import React from "react";
import loadingImg from "../assets/images/loading.gif";
import LottieModule from "react-lottie";
import animationData from '../assets/lotties/pizza.json';

const Lottie = LottieModule.default || LottieModule;

function LoadingLayout() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center ">
      <div className="loader-bg">
        <Lottie options={defaultOptions} height={200} width={200} />
      </div>
    </div>
  );
}

export default LoadingLayout;
