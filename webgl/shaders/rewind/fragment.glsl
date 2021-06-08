// Varyings
varying vec2 vUv;

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;
uniform float u_wobble_intensity;
uniform float u_distortion_intensity;
uniform float u_distortion_speed;
uniform float u_distortion_size;

const float PI = 3.14159265;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float vertical_bar(float uv_y, float offsetIntensity, float speed, float offset)
{
    float pos = mod(u_time * speed * u_distortion_speed + offset, 1.0);
    float displacement = sin(1.0 - tan(u_time * 0.24 + offset));
    displacement *= offsetIntensity;

    float edge0 = (pos - u_distortion_size);
    float edge1 = (pos + u_distortion_size);

    float x = smoothstep(edge0, pos, uv_y) * displacement;
    x -= smoothstep(pos, edge1, uv_y) * displacement;

    return x;
}

void main()
{
    vec2 uv = vUv;

    // wobble
    vec2 wobbl = vec2((u_wobble_intensity / 100.0) * rand(vec2(u_time, gl_FragCoord.y)), 0.);

    uv.x += vertical_bar(uv.y, u_distortion_intensity, 1.0, 405.00);
    uv.x += vertical_bar(uv.y, u_distortion_intensity, -0.1, 1000.0);
    uv.x += vertical_bar(uv.y, u_distortion_intensity, 0.8, 87.0);
    uv.x += vertical_bar(uv.y, u_distortion_intensity, 0.5, 87.0);

    // Texture
    // vec4 color = texture2D(u_texture, uv);
    vec4 color = texture2D(u_texture, uv + wobbl);
    
    gl_FragColor = color;
    // gl_FragColor = vec4(noise(vUv));
}