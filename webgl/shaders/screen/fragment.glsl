// Varyings
varying vec2 vUv;

// Uniforms
uniform vec3 u_resolution;
uniform float u_size;
uniform float u_scale;

uniform float u_stepFactor_0;
uniform float u_stepFactor_1;
uniform float u_stepFactor_2;
uniform float u_stepFactor_3;

uniform float u_textureAlpha_0;
uniform float u_textureAlpha_1;
uniform float u_textureAlpha_2;
uniform float u_textureAlpha_3;

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;

void main() {
    float scale = u_scale;

    vec2 centeredUv = vUv - 0.5;
    
    vec2 uv_0 = centeredUv * scale + 0.5;
    uv_0.x += u_size;
    uv_0.y -= u_size;

    vec2 uv_1 = centeredUv * scale + 0.5;
    uv_1.xy -= u_size;

    vec2 uv_2 = centeredUv * scale + 0.5;
    uv_2.xy += u_size;

    vec2 uv_3 = centeredUv * scale + 0.5;
    uv_3.y += u_size;
    uv_3.x -= u_size;

    vec4 texel_0 = texture2D(u_texture_0, uv_0);
    vec4 texel_1 = texture2D(u_texture_1, uv_1);
    vec4 texel_2 = texture2D(u_texture_2, uv_2);
    vec4 texel_3 = texture2D(u_texture_3, uv_3);

    float factore_0 = step(-1. + u_stepFactor_0, -vUv.x) * step(u_stepFactor_0, vUv.y);
    texel_0 *= factore_0 * u_textureAlpha_0;

    float factore_1 = step(u_stepFactor_1, vUv.x) * step(u_stepFactor_1, vUv.y);
    texel_1 *= factore_1 * u_textureAlpha_1;

    float factore_2 = step(-1. + u_stepFactor_2, -vUv.x) * step(-1. + u_stepFactor_2, -vUv.y);
    texel_2 *= factore_2 * u_textureAlpha_2;

    float factore_3 = step(u_stepFactor_3, vUv.x) * step(-1. + u_stepFactor_3, -vUv.y);
    texel_3 *= factore_3 * u_textureAlpha_3;

    vec4 blended = texel_0 + texel_1 + texel_2 + texel_3;

    gl_FragColor = blended;
}


// WITH ALPHA BLENDING

// void main() {
//     vec4 firstTexture = texture2D(u_texture_0, vUv);
//     vec4 secondTexture = texture2D(u_texture_1, vUv);
//     vec4 thirdTexture = texture2D(u_texture_2, vUv);
//     vec4 fourthTexture = texture2D(u_texture_3, vUv);

//     firstTexture.a = step(-0.5, -vUv.x) * step(0.5, vUv.y);
//     secondTexture.a = step(0.5, vUv.x) * step(0.5, vUv.y);
//     thirdTexture.a = step(-0.5, -vUv.x) * step(-0.5, -vUv.y);
//     fourthTexture.a = step(0.5, vUv.x) * step(-0.5, -vUv.y);
    
//     vec4 mixLeft = mix(firstTexture, thirdTexture, thirdTexture.a);
//     vec4 mixRight = mix(secondTexture, fourthTexture, fourthTexture.a);

//     gl_FragColor = mix(mixLeft, mixRight, mixRight.a);
// }