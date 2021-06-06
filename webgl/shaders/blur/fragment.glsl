// Varyings
varying vec2 vUv;

uniform sampler2D u_texture;
uniform sampler2D u_alphaTexture;

uniform vec2 u_resolution;
uniform vec2 u_blur_direction;
uniform float u_blur_factor;
uniform float u_spreading_treshold;
uniform float u_wobble_intensity;

// #pragma glslify: blur = require('glsl-fast-gaussian-blur/13')
#pragma glslify: blur = require('glsl-fast-gaussian-blur')
#pragma glslify: ease = require('glsl-easings/exponential-in')

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec4 texel = texture2D(u_texture, vUv);

    // wobble
    vec2 wobbl = vec2((u_wobble_intensity / 100.0) * rand(vec2(u_blur_factor, gl_FragCoord.y)), 0.) * u_blur_factor;

    float texel_alpha_scale = 1.0 / (1.0 + ease(max(u_blur_factor - u_spreading_treshold, 0.0)));

    vec2 texel_alpha_scaled_uv = vUv;
    texel_alpha_scaled_uv = (texel_alpha_scaled_uv - 0.5) * texel_alpha_scale + 0.5;

    vec4 texel_alpha = texture2D(u_alphaTexture, texel_alpha_scaled_uv + wobbl);

    texel_alpha.r *= texel_alpha.a;
    texel_alpha.g *= texel_alpha.a;
    texel_alpha.b *= texel_alpha.a;
    texel_alpha.a = 1.0;

    vec4 blured_texel = blur(u_texture, vUv + (wobbl * texel_alpha.r), u_resolution, u_blur_direction * texel_alpha.r);

    gl_FragColor = blured_texel;
    // gl_FragColor = texel_alpha;
}