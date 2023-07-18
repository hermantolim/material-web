/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {ChipHarness} from '../harness.js';

import {FilterChip} from './filter-chip.js';

@customElement('test-filter-chip')
class TestFilterChip extends FilterChip {
  declare primaryAction: HTMLElement;
}

describe('Filter chip', () => {
  const env = new Environment();

  async function setupTest() {
    const chip = new TestFilterChip();
    env.render(html`${chip}`);
    await env.waitForStability();
    return {chip, harness: new ChipHarness(chip)};
  }

  describe('selection', () => {
    it('should select on click', async () => {
      const {chip, harness} = await setupTest();

      await harness.clickWithMouse();
      expect(chip.selected).withContext('chip.selected').toBeTrue();
    });

    it('should deselect on click', async () => {
      const {chip, harness} = await setupTest();
      chip.selected = true;

      await harness.clickWithMouse();
      expect(chip.selected).withContext('chip.selected').toBeFalse();
    });

    it('should not select on click when disabled', async () => {
      const {chip, harness} = await setupTest();
      chip.disabled = true;

      await harness.clickWithMouse();
      expect(chip.selected).withContext('chip.selected').toBeFalse();
    });

    it('should dispatch "selected" event when selected changes programmatically',
       async () => {
         const {chip} = await setupTest();
         const handler = jasmine.createSpy();
         chip.addEventListener('selected', handler);

         chip.selected = true;
         await env.waitForStability();
         chip.selected = false;
         await env.waitForStability();
         expect(handler).toHaveBeenCalledTimes(2);
       });

    it('should dispatch "selected" event when selected changes by click',
       async () => {
         const {chip, harness} = await setupTest();
         const handler = jasmine.createSpy();
         chip.addEventListener('selected', handler);

         await harness.clickWithMouse();
         await harness.clickWithMouse();
         expect(handler).toHaveBeenCalledTimes(2);
       });
  });
});
