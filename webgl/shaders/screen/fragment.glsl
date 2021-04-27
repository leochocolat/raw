// Varyings
varying vec2 vUv;

// Split Screens uniforms

uniform vec3 u_resolution;
uniform float u_time;

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

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;

// Old screen effect uniforms

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

// Utils
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 scanline(float coord, vec3 screen, float speed, float intensity) {
    // With time
	screen.rgb -= sin(coord + u_time * speed) * intensity;

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

// Split Screens
vec4 splitScreens(vec2 uv) {
    vec2 centeredUv = uv - 0.5;
    
    vec2 uv_0 = centeredUv * u_scale_0 + 0.5;
    uv_0.x += u_size_0;
    uv_0.y -= u_size_0;

    vec2 uv_1 = centeredUv * u_scale_1 + 0.5;
    uv_1.xy -= u_size_1;

    vec2 uv_2 = centeredUv * u_scale_2 + 0.5;
    uv_2.xy += u_size_2;

    vec2 uv_3 = centeredUv * u_scale_3 + 0.5;
    uv_3.y += u_size_3;
    uv_3.x -= u_size_3;

    vec4 texel_0 = texture2D(u_texture_0, uv_0);
    vec4 texel_1 = texture2D(u_texture_1, uv_1);
    vec4 texel_2 = texture2D(u_texture_2, uv_2);
    vec4 texel_3 = texture2D(u_texture_3, uv_3);

    // Apply RGBShift
    texel_0 = RGBShift(uv_0, u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture_0);
    texel_1 = RGBShift(uv_1, u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture_1);
    texel_2 = RGBShift(uv_2, u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture_2);
    texel_3 = RGBShift(uv_3, u_rgb_shift_angle, u_rgb_shift_amount * u_global_intensity, u_texture_3);

    float factore_0 = step(-1. + u_step_factor_0, -vUv.x) * step(u_step_factor_0, vUv.y);
    texel_0 *= factore_0;

    float factore_1 = step(u_step_factor_1, vUv.x) * step(u_step_factor_1, vUv.y);
    texel_1 *= factore_1;

    float factore_2 = step(-1. + u_step_factor_2, -vUv.x) * step(-1. + u_step_factor_2, -vUv.y);
    texel_2 *= factore_2;

    float factore_3 = step(u_step_factor_3, vUv.x) * step(-1. + u_step_factor_3, -vUv.y);
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
    // UV Displacement
    vec2 crt_uv = crt(vUv, u_crt_bending * u_global_intensity);

    // Screens + RGBShift
    gl_FragColor = splitScreens(crt_uv);

    // Old Screen effect
    gl_FragColor = applyScanlines(gl_FragColor, vUv);
    gl_FragColor = applyColorFilter(gl_FragColor);
    gl_FragColor = applyWhiteNoise(gl_FragColor, vUv);
    gl_FragColor = applyVignettage(gl_FragColor, vUv);
}