varying vec2 v_uv;

varying vec3 vNormal;

varying vec3 vViewPosition;

#include <common>
#include <shadowmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>

void main() {
    v_uv = uv;
     vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

    #include <skinbase_vertex> 
    #include <begin_vertex> 
    #include <morphtarget_vertex> 
    #include <skinning_vertex> 
    #include <project_vertex> 

    vViewPosition = -mvPosition.xyz;

    vNormal = normalize( normalMatrix * normal );

    gl_Position = projectionMatrix * mvPosition;

    #include <shadowmap_vertex>
}





           