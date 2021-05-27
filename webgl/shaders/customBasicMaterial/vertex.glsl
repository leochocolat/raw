uniform float time;
attribute vec4 instanceMatrixColumn0;
attribute vec4 instanceMatrixColumn1;
attribute vec4 instanceMatrixColumn2;
attribute vec4 instanceMatrixColumn3;
attribute vec3 instanceNormalMatrixColumn0;
attribute vec3 instanceNormalMatrixColumn1;
attribute vec3 instanceNormalMatrixColumn2;
attribute float instanceSpeed;
attribute vec3 instanceColor;
out vec3 vInstanceColor;
attribute float textureIdx;
varying float vTextureIdx;
varying vec2 vUv;

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
// #define texture2D texture
// #include <skinning_pars_vertex>



#ifdef USE_SKINNING
    precision highp sampler2DArray;
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
    uniform sampler2DArray boneTexture;
    uniform int boneTextureSize;
	#ifdef BONE_TEXTURE
            mat4 getBoneMatrix( const in float i ) {
            float j = i * 4.0;
            float x = mod( j, float( boneTextureSize ) );
            float y = floor( j / float( boneTextureSize ) );
            float dx = 1.0 / float( boneTextureSize );
            float dy = 1.0 / float( boneTextureSize );
            y = dy * ( y + 0.5 );
            vec4 v1 = texture( boneTexture, vec3( dx * ( x + 0.5 ), y, gl_InstanceID ) );
            vec4 v2 = texture( boneTexture, vec3( dx * ( x + 1.5 ), y, gl_InstanceID ) );
            vec4 v3 = texture( boneTexture, vec3( dx * ( x + 2.5 ), y, gl_InstanceID ) );
            vec4 v4 = texture( boneTexture, vec3( dx * ( x + 3.5 ), y, gl_InstanceID ) );
            mat4 bone = mat4( v1, v2, v3, v4 );
            return bone;
        }
	#endif
#endif

#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>


varying float vInstanceID;

void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <skinbase_vertex>
	#ifdef USE_ENVMAP
        #include <beginnormal_vertex>
        #include <morphnormal_vertex>
        #include <skinnormal_vertex>
        //add to defaultnormal

        mat3 instanceNormalMatrix = mat3(
        	instanceNormalMatrixColumn0,
        	instanceNormalMatrixColumn1,
        	instanceNormalMatrixColumn2
        );
        objectNormal = instanceNormalMatrix * objectNormal;
        #include <defaultnormal_vertex>
        
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
    //add to skinning
    mat4 instanceMatrix = mat4(
        instanceMatrixColumn0,
        instanceMatrixColumn1,
        instanceMatrixColumn2,
        instanceMatrixColumn3
    );
    transformed = ( instanceMatrix * vec4( transformed, 1.0 ) ).xyz;
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>

    vInstanceID = float(gl_InstanceID);   
    vInstanceColor = instanceColor;
    vUv = uv;
    vTextureIdx = textureIdx;
}