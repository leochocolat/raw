// Varyings
varying vec2 vUv;

uniform sampler2D u_texture;
uniform float u_blur_level;

void main() {
    vec4 texel = texture2D(u_texture, vUv);
    float intensity = (texel.r + texel.r + texel.b) / 3.0;
    gl_FragColor = texel * u_blur_level;
}