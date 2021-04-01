// Varyings
varying vec2 vUv;

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_texture;
uniform float u_global_intensity;
uniform float u_blue_filter_intensity;
// Scanline
uniform float u_scanline_amount_factor;
uniform float u_scanline_min_intensity;
uniform float u_scanline_max_intensity;
uniform float u_scanline_speed;
uniform bool u_scanline_vertical;
// RGB Shift
uniform float u_rgb_shift_amount;
uniform vec2 u_rgb_shift_angle;
// CRT
uniform float u_crt_bending;
// Noise
uniform float u_noise_scale;
uniform float u_noise_intensity;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 scanline(float coord, vec3 screen, float speed, float intensity)
{
    // With time
	screen.rgb -= sin(coord + u_time * speed) * intensity;

	return screen;
}

vec4 RGBShift(vec2 uv, vec2 angle, float amount, sampler2D texel)
{
    vec2 offset = amount * vec2( cos(angle.x), sin(angle.y));
    vec4 cr = texture2D(texel, uv + offset);
    vec4 cg = texture2D(texel, uv);
    vec4 cb = texture2D(texel, uv - offset);
    vec4 ca = texture2D(texel, uv - offset);

    vec4 final = vec4(cr.r, cg.g, cb.b, ca.a);

    return final;
}

vec2 crt(vec2 coord, float bend)
{
	// put in symmetrical coords
	coord = (coord - 0.5) * 2.0;

	coord *= 1.1;	

	// deform coords
	coord.x *= 1.0 + pow((abs(coord.y) * bend), 2.0);
	coord.y *= 1.0 + pow((abs(coord.x) * bend), 2.0);

	// transform back to 0.0 - 1.0 space
	coord  = (coord / 2.0) + 0.5;

	return coord;
}

void main()
{
    vec2 crt_uv = crt(vUv, u_crt_bending * u_global_intensity);

    vec4 base_color = RGBShift(crt_uv, u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture);

    // Scanline
    if (u_scanline_vertical)
    {
        base_color.rgb = scanline(vUv.x * u_resolution.x, base_color.rgb, u_scanline_speed, u_scanline_min_intensity + u_scanline_max_intensity * u_global_intensity);
    }
    else
    {
        base_color.rgb = scanline(vUv.y * u_resolution.y, base_color.rgb, u_scanline_speed, u_scanline_min_intensity + u_scanline_max_intensity * u_global_intensity);
    }

    // Adjust base color
    vec4 filtered_color = base_color;
    filtered_color.r -= filtered_color.r * u_blue_filter_intensity * u_global_intensity;
    base_color = filtered_color;

    // Noise
    float xs = floor(vUv.x * u_noise_scale * u_resolution.x / u_resolution.y);
    float ys = floor(vUv.y * u_noise_scale);
    vec4 noise_color = vec4(rand(vec2(xs * u_time, ys * u_time)) * u_noise_intensity * u_global_intensity);

    gl_FragColor = base_color + noise_color;
}