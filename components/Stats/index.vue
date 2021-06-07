<template>
    <div class="stats">

        <div class="content">

            <div ref="title" class="title">
                {{ title[lang] }}
            </div>

            <div ref="subtitle" class="subtitle">
                {{ subtitle[lang] }} #{{ userId }}
            </div>

            <div class="stats-container">

                <div v-for="(item, index) in statsLabels" :key="index" class="stat-row">
                    <div ref="statTitle" class="stat-title">
                        {{ item }}
                    </div>

                    <div ref="stat" class="stat" :class="index === 3 ? 'red' : ''">
                        {{ stats[index] }}
                    </div>

                    <div ref="highlight" class="highlight"></div>
                </div>

            </div>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
