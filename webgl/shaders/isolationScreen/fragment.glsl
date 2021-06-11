uniform sampler2D u_texture;
uniform float u_isolation_alpha;

varying vec2 v_uv;


void main() {
    vec4 texture = texture2D(u_texture, v_uv);
    gl_FragColor = vec4(texture.rgb, texture.a * u_isolation_alpha);
}