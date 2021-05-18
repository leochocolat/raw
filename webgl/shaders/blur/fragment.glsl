// Varyings
varying vec2 vUv;

uniform sampler2D u_texture;
uniform sampler2D u_alphaTexture;


uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_blur_direction;

// #pragma glslify: blur = require('glsl-fast-gaussian-blur/13')
#pragma glslify: blur = require('glsl-fast-gaussian-blur')


void main() {
    vec4 texel = texture2D(u_texture, vUv);
    vec4 texelAlpha = texture2D(u_alphaTexture, vUv);

    texelAlpha.r *= texelAlpha.a;
    texelAlpha.g *= texelAlpha.a;
    texelAlpha.b *= texelAlpha.a;
    texelAlpha.a = 1.0;

    // if(u_alphaTexture.r)
    vec4 blured_texel = blur(u_texture, vUv, u_resolution, u_blur_direction * texelAlpha.r);

    gl_FragColor = blured_texel;
}