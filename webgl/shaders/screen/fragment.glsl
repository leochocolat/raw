// Varyings
varying vec2 vUv;

// Uniforms
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;

void main() {
    gl_FragColor = texture2D(u_texture_0, vUv);
    // gl_FragColor = texture2D(u_texture_1, vUv);
    // gl_FragColor = texture2D(u_texture_2, vUv);
    // gl_FragColor = texture2D(u_texture_3, vUv);
}