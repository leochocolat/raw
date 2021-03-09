// Varyings
varying vec2 vUv;

// Uniforms
uniform vec3 u_resolution;
uniform float u_time;

uniform float u_step_factor_0;
uniform float u_step_factor_1;
uniform float u_step_factor_2;
uniform float u_step_factor_3;

uniform float u_texture_alpha_0;
uniform float u_texture_alpha_1;
uniform float u_texture_alpha_2;
uniform float u_texture_alpha_3;

uniform float u_scale_0;
uniform float u_scale_1;
uniform float u_scale_2;
uniform float u_scale_3;

uniform float u_size_0;
uniform float u_size_1;
uniform float u_size_2;
uniform float u_size_3;

uniform float u_scan_speed;
uniform float u_scan_strength;

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;

float hash12(vec2 p) {
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 uv) {
	float n0 = hash12(uv.xy + u_time * 6.0);
	float n1 = hash12(uv.xy - u_time * 4.0);
	vec4 noiseTexture0 = vec4(vec3(n0), 1.0);
	vec4 noiseTexture1 = vec4(vec3(n1), 1.0);
	return clamp(noiseTexture0.r + noiseTexture1.g, 0.96, 1.0);
}

float slowscan(vec2 uv) {
	return sin(u_resolution.y * uv.y * 0.02 + u_time * 6.0);
}

vec2 scandistort(vec2 uv) {
    float speed = u_time * u_scan_speed;
	float scan = clamp(cos(uv.y + speed) * u_scan_strength, 0.0, 1.0);
	float amount = scan * uv.x;

	float noise = hash12(vec2(uv.x, amount));
	vec4 noiseTexture = vec4(vec3(noise), 1.0);
	
	uv.x -= 0.05 * mix(noiseTexture.r * amount, amount, 0.9);

	return uv;	 
}

vec3 scanline(vec2 coord, vec3 screen)
{
	screen.rgb -= sin((coord.y + (u_time * 29.0))) * 0.02;
	return screen;
}

vec3 sampleSplit(sampler2D tex, vec2 coord)
{
	vec3 frag;
	frag.r = texture2D(tex, vec2(coord.x - 0.01 * sin(u_time), coord.y)).r;
	frag.g = texture2D(tex, vec2(coord.x                          , coord.y)).g;
	frag.b = texture2D(tex, vec2(coord.x + 0.01 * sin(u_time), coord.y)).b;
	return frag;
}

vec2 crt(vec2 coord, float bend)
{
	// put in symmetrical coords
	coord = (coord - 0.5) * 2.0;

	coord *= 1.1;	

	// deform coords
	coord.x *= 1.0 + pow((abs(coord.y) / bend), 2.0);
	coord.y *= 1.0 + pow((abs(coord.x) / bend), 2.0);

	// transform back to 0.0 - 1.0 space
	coord  = (coord / 2.0) + 0.5;

	return coord;
}

void main() {
    // Scan Distortion
    vec2 distorted_uv = vUv;
    distorted_uv = scandistort(distorted_uv);

    vec2 centeredUv = vUv - 0.5;
    
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

    float factore_0 = step(-1. + u_step_factor_0, -vUv.x) * step(u_step_factor_0, vUv.y);
    texel_0 *= factore_0 * u_texture_alpha_0;

    float factore_1 = step(u_step_factor_1, vUv.x) * step(u_step_factor_1, vUv.y);
    texel_1 *= factore_1 * u_texture_alpha_1;

    float factore_2 = step(-1. + u_step_factor_2, -vUv.x) * step(-1. + u_step_factor_2, -vUv.y);
    texel_2 *= factore_2 * u_texture_alpha_2;

    float factore_3 = step(u_step_factor_3, vUv.x) * step(-1. + u_step_factor_3, -vUv.y);
    texel_3 *= factore_3 * u_texture_alpha_3;

    vec4 blended = texel_0 + texel_1 + texel_2 + texel_3;

    // Scanlines
    vec2 screenSpace = vUv * u_resolution.xy;
	blended.rgb = scanline(screenSpace, blended.rgb);

    gl_FragColor = blended;
}


// WITH ALPHA BLENDING

// void main() {
//     vec4 firstTexture = texture2D(u_texture_0, vUv);
//     vec4 secondTexture = texture2D(u_texture_1, vUv);
//     vec4 thirdTexture = texture2D(u_texture_2, vUv);
//     vec4 fourthTexture = texture2D(u_texture_3, vUv);

//     firstTexture.a = step(-0.5, -vUv.x) * step(0.5, vUv.y);
//     secondTexture.a = step(0.5, vUv.x) * step(0.5, vUv.y);
//     thirdTexture.a = step(-0.5, -vUv.x) * step(-0.5, -vUv.y);
//     fourthTexture.a = step(0.5, vUv.x) * step(-0.5, -vUv.y);
    
//     vec4 mixLeft = mix(firstTexture, thirdTexture, thirdTexture.a);
//     vec4 mixRight = mix(secondTexture, fourthTexture, fourthTexture.a);

//     gl_FragColor = mix(mixLeft, mixRight, mixRight.a);
// }