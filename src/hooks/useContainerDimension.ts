import { useState } from "react"
interface Dimensions {
    width: number;
    height: number;
}

interface LayoutEvent {
    nativeEvent: {
        layout: Dimensions;
    };
}
export const useContainerDimension = () => {
    const [containerDimensions, setContainerDimensions] = useState<Dimensions | null>(null);
    const onContainerLayout = (event: LayoutEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerDimensions({ width, height });
    };
    return {containerDimensions, onContainerLayout};
}