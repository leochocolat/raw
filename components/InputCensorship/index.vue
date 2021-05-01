<template>
    <div class="input-censorship" :class="isOffRange ? 'is-off-range' : ''">

        <!-- Label -->
        <div class="label">
            <ArrowDown class="arrow-down" /><br>
            {{ label1 }}
        </div>

        <div ref="range" class="censorship-range">

            <div class="censorship-progress-container">
                <div class="censorship-progress" :style="`width: ${dragPosition}px;`"></div>
            </div>

            <div ref="rangeLimit" class="range-limit" :style="`width: ${(maxRange * 2) * 100}%; left: ${minFactor * 100}%`">
                <Frame />
                <span class="current-censorship"> {{ Math.round(newCensorshipFactor * 100) }}%</span>
            </div>

            <div class="cursor" :style="`transform: translateX(${dragPosition}px)`">
                <CursorCensorship />
            </div>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
