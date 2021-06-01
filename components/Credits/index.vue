<template>
    <div class="credits">

        <div class="title">
            <span>{{ lang === 'fr' ? 'Crédits' : 'Credits' }}</span>
        </div>

        <div class="content">

            <ul class="contrubutors-list">

                <li v-for="(item, index) in data.contributors" :key="index" class="contrubutors-list-item">
                    <div class="contributor-name">
                        {{ item.fields.name }}
                    </div>
                    <ul class="contributor-roles-list">
                        <li v-for="(role, i) in item.fields.roles" :key="i" class="contributor-roles-list-item">
                            {{ role }}
                        </li>
                    </ul>
                </li>

            </ul>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
