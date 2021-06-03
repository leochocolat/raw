// Varyings
varying vec2 vUv;

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

// Animations
uniform float u_alpha;

void main()
{
    vec4 texel = texture2D(u_texture, vUv);
    texel.a = u_alpha;

    gl_FragColor = texel;
}