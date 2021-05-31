<template>
    <div class="censorship" :class="isComplete ? 'is-complete' : ''">

        <div class="container">

            <div class="header">

                <CensorshipMessages
                    ref="censorshipMessages"
                    class="censorshipMessages"
                    :scene="data"
                />

                <CensorshipRangeError
                    ref="censorshipRangeError"
                    class="censorshipRangeError"
                    :class="isOffRange ? 'is-off-range' : ''"
                    :scene="data"
                />

            </div>

            <div class="form">

                <InputCensorship
                    ref="inputCensorship"
                    class="input-censorship"
                    :scene="data"
                    :label1="data.callToAction"
                    :label2="data.callToAction2"
                    :max-range="data.censorshipRange"
                />

                <InputCensorshipText
                    ref="inputCensorshipText"
                    class="input-censorship-text"
                    :scene="data"
                    :label1="data.callToAction"
                    :label2="data.callToAction2"
                />

            </div>

        </div>

    </div>
</template>

<script src="./script.js"></script>
<style src="./style.scss" lang="scss" scoped></style>
