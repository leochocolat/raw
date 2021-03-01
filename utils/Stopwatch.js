class Stopwatch {
    constructor() {
        this.startTime = null;
        this.endTime = null;
    }

    get duration() {
        return this.endTime - this.startTime;
    }

    start() {
        this.startTime = Date.now();
    }

    stop() {
        this.endTime = Date.now();
    }
}

export default Stopwatch;
