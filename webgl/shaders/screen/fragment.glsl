// Varyings
varying vec2 vUv;

// Uniforms
uniform vec3 u_resolution;

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;

void main() {
    float scale = 2.0;

    vec2 uv_0 = (vUv - 0.5) * scale + 0.5;
    uv_0.x += 0.5;
    uv_0.y -= 0.5;

    vec2 uv_1 = (vUv - 0.5) * scale + 0.5;
    uv_1.y -= 0.5;
    uv_1.x -= 0.5;

    vec2 uv_2 = (vUv - 0.5) * scale + 0.5;
    uv_2.y += 0.5;
    uv_2.x += 0.5;

    vec2 uv_3 = (vUv - 0.5) * scale + 0.5;
    uv_3.y += 0.5;
    uv_3.x -= 0.5;

    vec4 texel_0 = texture2D(u_texture_0, uv_0);
    vec4 texel_1 = texture2D(u_texture_1, uv_1);
    vec4 texel_2 = texture2D(u_texture_2, uv_2);
    vec4 texel_3 = texture2D(u_texture_3, uv_3);

    float factore_0 = step(-0.5, -vUv.x) * step(0.5, vUv.y);
    texel_0 *= factore_0;

    float factore_1 = step(0.5, vUv.x) * step(0.5, vUv.y);
    texel_1 *= factore_1;

    float factore_2 = step(-0.5, -vUv.x) * step(-0.5, -vUv.y);
    texel_2 *= factore_2;

    float factore_3 = step(0.5, vUv.x) * step(-0.5, -vUv.y);
    texel_3 *= factore_3;

    vec4 blended = texel_0 + texel_1 + texel_2 + texel_3;

    gl_FragColor = blended;
}