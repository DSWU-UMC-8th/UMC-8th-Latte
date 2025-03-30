import clsx from "clsx";
import { THEME, useTheme } from "../context/ThemeProvider";

const ThemeContent = () => {
    const { theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;
    return (
        <div className={clsx("p-4 h-dvh", isLightMode ? "bg-white" : "bg-gray-800")}>
            <h2
                className={clsx(
                "text-wxl font-bold w-50 h-10 content-center text-center rounded-lg",
                isLightMode ? "text-black bg-[#f3f2f8]" : "text-white bg-[#101011]"
                )}
            >
                Theme Content
            </h2>
            <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque veniam soluta non distinctio harum porro
                deleniti, labore autem repudiandae adipisci laudantium nemo, tempora deserunt ullam! Officia accusamus mollitia
                eveniet eligendi!
            </p>
        </div>
    );
};

export default ThemeContent;