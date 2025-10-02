import * as Hammer from 'hammerjs';

import {Injectable} from '@angular/core';
import {HammerGestureConfig} from '@angular/platform-browser';

@Injectable()
export class UchHammerConfigService extends HammerGestureConfig {
  overrides = {
    pan: {direction: Hammer.DIRECTION_ALL},
    swipe: {direction: Hammer.DIRECTION_VERTICAL},
  } as any;
}
