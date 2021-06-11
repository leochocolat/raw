// Varyings
varying vec2 vUv;

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

// Distortion
uniform float u_wobble_intensity;
uniform float u_distortion_intensity;
uniform float u_distortion_speed;
uniform float u_distortion_size;
// RGB Shift
uniform float u_rgb_shift_amount;
uniform vec2 u_rgb_shift_angle;
// Alpha
uniform float u_alpha;
uniform float u_black_filter;

const float PI = 3.14159265;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float vertical_bar(float uv_y, float offsetIntensity, float speed, float offset) {
    float pos = mod(u_time * speed * u_distortion_speed + offset, 1.0);
    float displacement = sin(1.0 - tan(u_time * 0.24 + offset));
    displacement *= offsetIntensity;

    float edge0 = (pos - u_distortion_size);
    float edge1 = (pos + u_distortion_size);

    float x = smoothstep(edge0, pos, uv_y) * displacement;
    x -= smoothstep(pos, edge1, uv_y) * displacement;

    return x;
}

vec4 RGBShift(vec2 uv, vec2 angle, float amount, sampler2D texel) {
    vec2 offset = amount * vec2( cos(angle.x), sin(angle.y));
    vec4 cr = texture2D(texel, uv + offset);
    vec4 cg = texture2D(texel, uv);
    vec4 cb = texture2D(texel, uv - offset);
    vec4 ca = texture2D(texel, uv - offset);

    vec4 final = vec4(cr.r, cg.g, cb.b, ca.a);

    return final;
}

void main() {
    vec2 uv = vUv;
    uv.y = 1.0 - uv.y;

    // wobble
    vec2 wobbl = vec2((u_wobble_intensity / 100.0) * rand(vec2(u_time, gl_FragCoord.y)), 0.);

    uv.x += vertical_bar(uv.y, u_distortion_intensity, 1.0, 405.00);
    uv.x += vertical_bar(uv.y, u_distortion_intensity, -0.1, 1000.0);
    uv.x += vertical_bar(uv.y, u_distortion_intensity, 0.8, 87.0);
    uv.x += vertical_bar(uv.y, u_distortion_intensity, 0.5, 87.0);


    vec4 texel = texture2D(u_texture, uv + wobbl);
    texel = RGBShift(uv + wobbl, u_rgb_shift_angle, u_rgb_shift_amount, u_texture);
    texel.a = u_alpha;

    float monochome = step(u_black_filter, texel.r + texel.g + texel.b / 3.0);

    if (monochome == 0.0) discard;

    gl_FragColor = texel;
}