uniform sampler2D u_scene_texture;
uniform float u_isolation_alpha;

varying vec2 vUv;


void main() {
    vec4 texture = texture2D(u_scene_texture, vUv);
    gl_FragColor = vec4(texture.rgb, texture.a * u_isolation_alpha);
}