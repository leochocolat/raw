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

// https://www.shadertoy.com/view/4djSRW
float random(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * 443.8975);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec4 texel = texture2D(u_texture, vUv);

    // float perlin_noise = noise(vUv * 50.0 + u_blur_factor) + 0.1;
    // float noise = random(vUv * (1.0 + u_blur_factor)) + 0.1;

    // wobble
    vec2 wobbl = vec2((u_wobble_intensity / 100.0) * rand(vec2(u_blur_factor, gl_FragCoord.y)), 0.) * u_blur_factor;

    // vec4 perlin_noise_texel = vec4(vec3(perlin_noise), 1.0);
    // vec4 noise_texel = vec4(vec3(noise), 1.0);

    // float blur_scale_factor = smoothstep(u_spreading_treshold, 1.0, u_blur_factor);
    float texel_alpha_scale = 1.0 / (1.0 + ease(max(u_blur_factor - u_spreading_treshold, 0.0)));

    vec2 texel_alpha_scaled_uv = vUv;
    texel_alpha_scaled_uv = (texel_alpha_scaled_uv - 0.5) * texel_alpha_scale + 0.5;

    vec4 texel_alpha = texture2D(u_alphaTexture, texel_alpha_scaled_uv + wobbl);

    texel_alpha.r *= texel_alpha.a;
    texel_alpha.g *= texel_alpha.a;
    texel_alpha.b *= texel_alpha.a;
    texel_alpha.a = 1.0;

    // if(u_alphaTexture.r)
    vec4 blured_texel = blur(u_texture, vUv + (wobbl * texel_alpha.r), u_resolution, u_blur_direction * texel_alpha.r);

    gl_FragColor = blured_texel;
    // gl_FragColor = texel_alpha;
    // gl_FragColor = perlin_noise_texel;
    // gl_FragColor = noise_texel;
}