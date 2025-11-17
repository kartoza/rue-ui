declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Loader } from 'three';
  export class GLTFLoader extends Loader {
    constructor();
    load(url, onLoad, onProgress?, onError?);
    parse(data, path, onLoad);
  }
}
