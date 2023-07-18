/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {CircularProgress} from './lib/circular-progress.js';
import {styles} from './lib/circular-progress-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-circular-progress': MdCircularProgress;
  }
}

/**
 * @summary Circular progress indicators display progress by animating along an
 * invisible circular track in a clockwise direction. They can be applied
 * directly to a surface, such as a button or card.
 *
 * @description
 * Progress indicators inform users about the status of ongoing processes.
 * - Determinate indicators display how long a process will take.
 * - Indeterminate indicators express an unspecified amount of wait time.
 */
@customElement('md-circular-progress')
export class MdCircularProgress extends CircularProgress {
  static override styles = [styles];
}
