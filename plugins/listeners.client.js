import WindowResizeObserver from '@/utils/WindowResizeObserver';
import Breakpoints from '@/utils/Breakpoints';

export default ({ store }) => {
    function setup() {
        resize();
        setupEventListeners();
    }

    function resize() {
        const width = WindowResizeObserver.width;
        const height = WindowResizeObserver.height;
        const breakpoint = Breakpoints.current;

        store.dispatch('device/setViewportSize', { width, height });
        store.dispatch('device/setBreakpoint', breakpoint);
    }

    function setupEventListeners() {
        WindowResizeObserver.addEventListener('resize', resizeHandler);
    }

    function resizeHandler() {
        resize();
    }

    setup();
};
