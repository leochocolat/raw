// Varyings
varying vec2 vUv;

uniform sampler2D u_texture;
uniform float u_blur_level;
uniform vec2 u_resolution;
uniform float u_time;

// #pragma glslify: blur1 = require('glsl-fast-gaussian-blur/13')
#pragma glslify: blur = require('glsl-fast-gaussian-blur')


void main() {
    // Horizontal
    vec2 blur_direction = vec2(1.0, 0.0);

    // Vertical
    // vec2 blur_direction = vec2(0.0, 1.0);

    vec4 texel = texture2D(u_texture, vUv);

    vec4 blured_texel = blur(u_texture, vUv, u_resolution, blur_direction * u_blur_level * 10.0);

    gl_FragColor = blured_texel;
}