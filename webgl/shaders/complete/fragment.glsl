// Varyings
varying vec2 vUv;

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;
uniform float u_distortion_intensity;
uniform float u_wobble_intensity;
uniform float u_line_intensity;
uniform float u_texture_alpha;

const float PI = 3.14159265;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float sample_noise()
{
    vec2 uv = mod(gl_FragCoord.xy + vec2(0.0, 100. * u_time), u_resolution);
    float value = rand(uv);
    return pow(value, 7.); //  sharper ramp
}

void main()
{
    // wobble
    vec2 wobbl = vec2((u_wobble_intensity / 100.0) * rand(vec2(u_time, gl_FragCoord.y)), 0.);

    //  band distortion
    float t_val = tan(0.25 * u_time + vUv.y * PI * .67);
    vec2 tan_off = vec2(wobbl.x * min(0., t_val), 0.) * u_distortion_intensity;

    // Texture
    vec4 color = texture2D(u_texture, vUv + wobbl + tan_off);
    color *= u_texture_alpha;
    vec4 color = texture2D(u_texture, vUv + wobbl);

    //  noise lines
    float ival = u_resolution.y / 4.;
    float r = rand(vec2(u_time, gl_FragCoord.y));
    float on = floor(float(int(gl_FragCoord.y + (u_time * r * 1000.)) % int(ival + u_line_intensity)) / ival);
    float wh = sample_noise() * on;

    color.r += wh;
    color.g += wh;
    color.b += wh;
    
    gl_FragColor = color;
}