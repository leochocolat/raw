<template>
    <div class="credits">

        <div class="container">

            <div class="title">
                <LogoAnimation :autoplay="true" />
                <span ref="spanTitle" class="spanTitle">{{ lang === 'fr' ? 'Crédits' : 'Credits' }}</span>
            </div>

            <div class="content">

                <ul class="contrubutors-list">

                    <li v-for="(item, index) in data.contributors" :key="index" class="contrubutors-list-item">
                        <div ref="name" class="contributor-name">
                            <a :href="item.fields.portfolio" target="_blank" rel="noopener noreferrer">{{ item.fields.name }}</a>
                        </div>
                        <ul class="contributor-roles-list">
                            <li v-for="(role, i) in item.fields.roles" :key="i" class="contributor-roles-list-item">
                                <div ref="role" class="contributor-role">
                                    {{ role }}
                                </div>
                            </li>
                        </ul>
                    </li>

                </ul>

            </div>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
