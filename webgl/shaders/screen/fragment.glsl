// Varyings
varying vec2 vUv;

uniform vec3 u_resolution;
uniform float u_time;

// Split Screens uniforms
uniform float u_step_factor_0;
uniform float u_step_factor_1;
uniform float u_step_factor_2;
uniform float u_step_factor_3;

uniform float u_scale_0;
uniform float u_scale_1;
uniform float u_scale_2;
uniform float u_scale_3;

uniform float u_size_0;
uniform float u_size_1;
uniform float u_size_2;
uniform float u_size_3;

uniform float u_texture_alpha_0;
uniform float u_texture_alpha_1;
uniform float u_texture_alpha_2;
uniform float u_texture_alpha_3;

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;

uniform float u_noise_alpha_0;
uniform float u_noise_alpha_1;
uniform float u_noise_alpha_2;
uniform float u_noise_alpha_3;

uniform float u_completed_0;
uniform float u_completed_1;
uniform float u_completed_2;
uniform float u_completed_3;

uniform float u_completed_alpha_0;
uniform float u_completed_alpha_1;
uniform float u_completed_alpha_2;
uniform float u_completed_alpha_3;

uniform float u_rewind_0;
uniform float u_rewind_1;
uniform float u_rewind_2;
uniform float u_rewind_3;

uniform float u_global_intensity;
// Color filter
uniform float u_red_filter_intensity;
uniform float u_green_filter_intensity;
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
// Vignette
uniform float u_vignette_scale;
uniform float u_vignette_intensity;
// Completed
uniform float u_distortion_intensity;
uniform float u_wobble_intensity;
uniform float u_line_intensity;
// Rewind
uniform float u_rewind_wobble_intensity;
uniform float u_rewind_distortion_size;
uniform float u_rewind_distortion_speed;
uniform float u_rewind_distortion_intensity;
// Scroll
uniform float u_scroll_offset;

const float PI = 3.14159265;

// Utils
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// https://www.shadertoy.com/view/4djSRW
// float rand(vec2 p) {
//     vec3 p3  = fract(vec3(p.xyx) * 443.8975);
//     p3 += dot(p3, p3.yzx + 19.19);
//     return fract((p3.x + p3.y) * p3.z);
// }

float sample_noise()
{
    vec2 uv = mod(gl_FragCoord.xy + vec2(0.0, 100. * u_time), u_resolution.xy);
    float value = rand(uv);
    return pow(value, 7.); //  sharper ramp
}

vec3 scanline(float coord, vec3 screen, float speed, float intensity) {
    // With time
	screen.rgb -= sin((coord * u_scanline_amount_factor) + u_time * speed) * intensity;

	return screen;
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

vec2 crt(vec2 coord, float bend) {
	// put in symmetrical coords
	coord = (coord - 0.5) * 2.0;

	// coord *= 1.1;	

	// deform coords
	coord.x *= 1.0 + pow((abs(coord.y) * bend), 2.0);
	coord.y *= 1.0 + pow((abs(coord.x) * bend), 2.0);

	// transform back to 0.0 - 1.0 space
	coord = (coord / 2.0) + 0.5;

	return coord;
}

float vertical_bar(float uv_y, float offset_intensity, float speed, float offset)
{
    float pos = mod(u_time * speed * u_rewind_distortion_speed + offset, 1.0);
    float displacement = sin(1.0 - tan(u_time * 0.24 + offset));
    displacement *= offset_intensity;

    float edge0 = (pos - u_rewind_distortion_size);
    float edge1 = (pos + u_rewind_distortion_size);

    float x = smoothstep(edge0, pos, uv_y) * displacement;
    x -= smoothstep(pos, edge1, uv_y) * displacement;

    return x;
}

vec2 vertical_bars(vec2 uv, float rewind_value) {
    uv.x += vertical_bar(uv.y, u_rewind_distortion_intensity, 1.0, 405.00) * rewind_value;
    uv.x += vertical_bar(uv.y, u_rewind_distortion_intensity, -0.1, 1000.0) * rewind_value;
    uv.x += vertical_bar(uv.y, u_rewind_distortion_intensity, 0.8, 87.0) * rewind_value;
    uv.x += vertical_bar(uv.y, u_rewind_distortion_intensity, 0.5, 87.0) * rewind_value;

    return uv;
}

// Split Screens
vec4 splitScreens(vec2 uv) {
    vec2 centeredUv = uv - 0.5;
    
    vec2 uv_0 = centeredUv * u_scale_0 + 0.5;
    uv_0.x += u_size_0;
    uv_0.y -= u_size_0 + u_scroll_offset * 2.0;

    vec2 uv_1 = centeredUv * u_scale_1 + 0.5;
    uv_1.x -= u_size_1;
    uv_1.y -= u_size_1 + u_scroll_offset * 2.0;

    vec2 uv_2 = centeredUv * u_scale_2 + 0.5;
    uv_2.x += u_size_2;
    uv_2.y += u_size_2 - u_scroll_offset * 2.0;

    vec2 uv_3 = centeredUv * u_scale_3 + 0.5;
    uv_3.x -= u_size_3;
    uv_3.y += u_size_3 - u_scroll_offset * 2.0;

    // wobble
    vec2 wobbl = vec2((u_wobble_intensity / 100.0) * rand(vec2(u_time, gl_FragCoord.y)), 0.);

    //  band distortion
    float t_val = tan(0.25 * u_time + vUv.y * PI * .67);
    vec2 tan_off = vec2(wobbl.x * min(0., t_val), 0.) * u_distortion_intensity;

    // Apply rewind
    vec2 rewind_wobble = vec2((u_rewind_wobble_intensity / 100.0) * rand(vec2(u_time, gl_FragCoord.y)), 0.);

    uv_0 = vertical_bars(uv_0, u_rewind_0) + rewind_wobble * u_rewind_0;
    uv_1 = vertical_bars(uv_1, u_rewind_1) + rewind_wobble * u_rewind_1;
    uv_2 = vertical_bars(uv_2, u_rewind_2) + rewind_wobble * u_rewind_2;
    uv_3 = vertical_bars(uv_3, u_rewind_3) + rewind_wobble * u_rewind_3;

    // Scroll
    // uv_0.y -= u_scroll_offset * 2.0;
    // uv_1.y -= u_scroll_offset * 2.0;
    // uv_2.y -= u_scroll_offset * 2.0;
    // uv_3.y -= u_scroll_offset * 2.0;

    vec4 texel_0 = texture2D(u_texture_0, uv_0 + ((wobbl + tan_off) * u_completed_0));
    vec4 texel_1 = texture2D(u_texture_1, uv_1 + ((wobbl + tan_off) * u_completed_1));
    vec4 texel_2 = texture2D(u_texture_2, uv_2 + ((wobbl + tan_off) * u_completed_2));
    vec4 texel_3 = texture2D(u_texture_3, uv_3 + ((wobbl + tan_off) * u_completed_3));

    // Apply RGBShift
    texel_0 = RGBShift(uv_0 + ((wobbl + tan_off) * u_completed_0), u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture_0) * u_texture_alpha_0;
    texel_1 = RGBShift(uv_1 + ((wobbl + tan_off) * u_completed_1), u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture_1) * u_texture_alpha_1;
    texel_2 = RGBShift(uv_2 + ((wobbl + tan_off) * u_completed_2), u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture_2) * u_texture_alpha_2;
    texel_3 = RGBShift(uv_3 + ((wobbl + tan_off) * u_completed_3), u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture_3) * u_texture_alpha_3;

    // Apply Noise
    vec4 noise_texel_0 = vec4(vec3(rand(vUv * u_time)), 1.0);
    texel_0 = mix(texel_0, noise_texel_0, u_noise_alpha_0);

    vec4 noise_texel_1 = vec4(vec3(rand(vUv * u_time)), 1.0);
    texel_1 = mix(texel_1, noise_texel_1, u_noise_alpha_1);
    
    vec4 noise_texel_2 = vec4(vec3(rand(vUv * u_time)), 1.0);
    texel_2 = mix(texel_2, noise_texel_2, u_noise_alpha_2);

    vec4 noise_texel_3 = vec4(vec3(rand(vUv * u_time)), 1.0);
    texel_3 = mix(texel_3, noise_texel_3, u_noise_alpha_3);

    // Apply completed alpha
    texel_0.r *= u_completed_alpha_0;
    texel_0.g *= u_completed_alpha_0;
    texel_0.b *= u_completed_alpha_0;

    texel_1.r *= u_completed_alpha_1;
    texel_1.g *= u_completed_alpha_1;
    texel_1.b *= u_completed_alpha_1;

    texel_2.r *= u_completed_alpha_2;
    texel_2.g *= u_completed_alpha_2;
    texel_2.b *= u_completed_alpha_2;

    texel_3.r *= u_completed_alpha_3;
    texel_3.g *= u_completed_alpha_3;
    texel_3.b *= u_completed_alpha_3;

    //  Noise lines
    float ival = u_resolution.y / 4.;
    float r = rand(vec2(u_time, gl_FragCoord.y));
    float on = floor(float(int(gl_FragCoord.y + (u_time * r * 1000.)) % int(ival + u_line_intensity)) / ival);
    float wh = sample_noise() * on;

    texel_0.r += wh * u_completed_0;
    texel_0.g += wh * u_completed_0;
    texel_0.b += wh * u_completed_0;

    texel_1.r += wh * u_completed_1;
    texel_1.g += wh * u_completed_1;
    texel_1.b += wh * u_completed_1;

    texel_2.r += wh * u_completed_2;
    texel_2.g += wh * u_completed_2;
    texel_2.b += wh * u_completed_2;

    texel_3.r += wh * u_completed_3;
    texel_3.g += wh * u_completed_3;
    texel_3.b += wh * u_completed_3;

    vec2 plane_uv = vUv;
    // plane_uv.y -= u_scroll_offset;

    // Split
    float factore_0 = step(-1. + u_step_factor_0, -plane_uv.x) * step(u_step_factor_0, plane_uv.y);
    texel_0 *= factore_0;

    float factore_1 = step(u_step_factor_1, plane_uv.x) * step(u_step_factor_1, plane_uv.y);
    texel_1 *= factore_1;

    float factore_2 = step(-1. + u_step_factor_2, -plane_uv.x) * step(-1. + u_step_factor_2, -plane_uv.y);
    texel_2 *= factore_2;

    float factore_3 = step(u_step_factor_3, plane_uv.x) * step(-1. + u_step_factor_3, -plane_uv.y);
    texel_3 *= factore_3;

    vec4 blended = texel_0 + texel_1 + texel_2 + texel_3;

    return blended;
}

// Old screen effect
vec4 applyScanlines(vec4 texel, vec2 uv) {
    if (u_scanline_vertical) {
        texel.rgb = scanline(uv.x * u_resolution.x, texel.rgb, u_scanline_speed, u_scanline_min_intensity + u_scanline_max_intensity * u_global_intensity);
    }
    else {
        texel.rgb = scanline(uv.y * u_resolution.y, texel.rgb, u_scanline_speed, u_scanline_min_intensity + u_scanline_max_intensity * u_global_intensity);
    }

    return texel;
}

vec4 applyColorFilter(vec4 texel) {
    vec4 filtered_color = texel;
    filtered_color.r += filtered_color.r * u_red_filter_intensity * u_global_intensity;
    filtered_color.b += filtered_color.b * u_blue_filter_intensity * u_global_intensity;
    filtered_color.g += filtered_color.g * u_green_filter_intensity * u_global_intensity;
    return filtered_color;
}

vec4 applyWhiteNoise(vec4 texel, vec2 uv) {
    float xs = floor(uv.x * u_noise_scale * u_resolution.x / u_resolution.y);
    float ys = floor(uv.y * u_noise_scale);
    vec4 noise_color = vec4(rand(vec2(xs * u_time, ys * u_time)) * u_noise_intensity * u_global_intensity);
    return texel + noise_color;
}

vec4 applyVignettage(vec4 texel, vec2 uv) {
    vec2 vig_uv = vUv; 
    vig_uv *=  1.0 - vig_uv.yx;
    float vig = vig_uv.x * vig_uv.y * u_vignette_intensity; // multiply with sth for intensity
    vig = pow(vig, u_vignette_scale * u_global_intensity); // change pow for modifying the extend of the vignette   

    return texel * vig;
}

void main() {
    vec2 uv = vUv;

    // UV Displacement
    vec2 crt_uv = crt(uv, u_crt_bending * u_global_intensity);

    // Screens + RGBShift
    gl_FragColor = splitScreens(crt_uv);

    // Old Screen effect
    gl_FragColor = applyScanlines(gl_FragColor, uv);
    gl_FragColor = applyColorFilter(gl_FragColor);
    gl_FragColor = applyWhiteNoise(gl_FragColor, uv);
    gl_FragColor = applyVignettage(gl_FragColor, uv);
}