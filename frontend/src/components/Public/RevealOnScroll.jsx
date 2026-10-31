import React, { useEffect, useRef, useState } from "react";

/**
 * RevealOnScroll
 * Smoothly reveals child elements as they enter the viewport during scrolling.
 * Supports fade-up, fade-in, fade-left, fade-right, zoom-in.
 */
const RevealOnScroll = ({
    children,
    animation = "fade-up",
    delay = 0,
    duration = 650,
    className = "",
    threshold = 0.12,
    rootMargin = "0px 0px -40px 0px"
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Fallback for environments without IntersectionObserver
        if (typeof IntersectionObserver === "undefined") {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold,
                rootMargin
            }
        );

        observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
        };
    }, [threshold, rootMargin]);

    // Initial hidden style based on animation variant
    const getHiddenStyle = () => {
        switch (animation) {
            case "fade-up":
                return "opacity-0 translate-y-7";
            case "fade-down":
                return "opacity-0 -translate-y-7";
            case "fade-left":
                return "opacity-0 translate-x-7";
            case "fade-right":
                return "opacity-0 -translate-x-7";
            case "zoom-in":
                return "opacity-0 scale-95";
            case "fade":
            default:
                return "opacity-0";
        }
    };

    const getVisibleStyle = () => {
        return "opacity-100 translate-y-0 translate-x-0 scale-100";
    };

    return (
        <div
            ref={ref}
            className={`transition-all ease-out ${
                isVisible ? getVisibleStyle() : getHiddenStyle()
            } ${className}`}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
                willChange: "opacity, transform"
            }}
        >
            {children}
        </div>
    );
};

export default RevealOnScroll;
