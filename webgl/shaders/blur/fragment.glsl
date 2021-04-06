// Varyings
varying vec2 vUv;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_blur_direction;

#pragma glslify: blur = require('glsl-fast-gaussian-blur/13')
// #pragma glslify: blur = require('glsl-fast-gaussian-blur')


void main() {
    vec4 texel = texture2D(u_texture, vUv);

    vec4 blured_texel = blur(u_texture, vUv, u_resolution, u_blur_direction);

    gl_FragColor = blured_texel;
}