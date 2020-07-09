import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as THREE from 'three';

import { AppModule } from './app/app.module';

window['THREE'] = THREE;

import('three/examples/js/controls/OrbitControls').then(() =>
platformBrowserDynamic().bootstrapModule(AppModule)).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;

  // Otherise, log the boot error
}).catch(err => console.error(err));