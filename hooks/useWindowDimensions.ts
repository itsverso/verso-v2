import { useEffect, useState } from "react";

type WindowDimentions = {
	width: number;
	height: number;
};

const useWindowDimension = (): WindowDimentions => {
	const [windowDimensions, setWindowDimensions] = useState<WindowDimentions>({
		width: 0,
		height: 0,
	});
	useEffect(() => {
		function handleResize(): void {
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		handleResize();
		window.addEventListener("resize", handleResize);
		return (): void => window.removeEventListener("resize", handleResize);
	}, []); // Empty array ensures that effect is only run on mount

	return windowDimensions;
};

export default useWindowDimension;
