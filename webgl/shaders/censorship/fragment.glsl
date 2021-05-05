// Varyings
varying vec2 v_uv;

uniform sampler2D u_texture_initial;
uniform sampler2D u_blur_mask;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_size;

vec2 resized_uv(vec2 inital_uv, vec2 aspect_ratio)
{
    vec2 ratio = vec2(
      min((u_resolution.x / u_resolution.y) / (aspect_ratio.x / aspect_ratio.y), 1.0),
      min((u_resolution.y / u_resolution.x) / (aspect_ratio.y / aspect_ratio.x), 1.0)
    );

    vec2 new_uv = vec2(
      inital_uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      inital_uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    return new_uv;
}

void main() {
    vec2 r_uv = resized_uv(v_uv, u_size);

    vec4 blur_mask_texel = texture2D(u_blur_mask, r_uv);
    vec4 blur_texel = texture2D(u_texture, r_uv);

    // Apply mask on blur texel
    // blur_texel.a = blur_mask_texel.r;

    vec4 initial_texel = texture2D(u_texture_initial, r_uv);

    // Apply mask inverse on initial texel
    
    vec4 texel = initial_texel;
    texel = blur_texel;
    // texel = blur_mask_texel;


    gl_FragColor = texel;
}