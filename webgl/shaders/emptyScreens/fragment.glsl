uniform sampler2D u_screen_texture;

varying vec2 vUv;


void main() {
    vec4 texture = texture2D(u_screen_texture, vUv);
    gl_FragColor = vec4(texture.rgb, texture.a);
    // gl_FragColor = vec4(vUv.y, 0.0, 0.0, 1.0);

}