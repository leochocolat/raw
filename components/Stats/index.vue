<template>
    <div class="stats">

        <div class="content">

            <div class="title">
                {{ title[lang] }}
            </div>

            <div class="subtitle">
                {{ subtitle[lang] }} #{{ userId }}
            </div>

            <div class="stats-container">

                <div v-for="(item, index) in statsLabels" :key="index" class="stat-row">
                    <div class="stat-title">
                        {{ item }}
                    </div>

                    <div class="stat" :class="index === 3 ? 'red' : ''">
                        {{ stats[index] }}%
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
