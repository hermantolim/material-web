/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ElementWithHarness, Harness} from '../testing/harness.js';

import {Tab} from './lib/tab.js';
import {Tabs} from './lib/tabs.js';

/**
 * Test harness for Tab.
 */
export class TabHarness extends Harness<Tab> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot
        .querySelector<HTMLButtonElement|HTMLLinkElement>('.button')!;
  }

  private async completeIndicatorAnimation() {
    await this.element.updateComplete;
    const animations = this.element.indicator.getAnimations();
    for (const animation of animations) {
      animation.finish();
    }
  }

  async isIndicatorShowing() {
    await this.completeIndicatorAnimation();
    const opacity = getComputedStyle(this.element.indicator)['opacity'];
    return opacity === '1';
  }
}

/**
 * Test harness for Tabs.
 */
export class TabsHarness extends Harness<Tabs> {
  // Note, Tabs interactive element is the interactive element of the
  // selected tab.
  override async getInteractiveElement() {
    await this.element.updateComplete;
    const selectedItemHarness =
        (this.element.selectedItem as ElementWithHarness<Tab>).harness as
            TabHarness ??
        new TabHarness(this.element.selectedItem);
    return await selectedItemHarness.getInteractiveElement();
  }

  get harnessedItems() {
    // Test access to protected property
    // tslint:disable-next-line:no-dict-access-on-struct-type
    return (this.element['items'] as Array<ElementWithHarness<Tab>>)
        .map(item => {
          return (item.harness ?? new TabHarness(item)) as TabHarness;
        });
  }
}
